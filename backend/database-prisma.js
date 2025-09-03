const prisma = require('./prisma-client');
const bcrypt = require('bcryptjs');

class ProcessFlowDatabasePrisma {
    constructor() {
        this.prisma = prisma;
    }

    async init() {
        try {
            await this.prisma.$connect();
            console.log('Prisma database connection established');
            
            // Check if we need to create initial data
            await this.insertInitialData();
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    async insertInitialData() {
        try {
            // Check if admin user exists
            const adminUser = await this.prisma.user.findUnique({
                where: { username: 'admin' }
            });

            if (!adminUser) {
                // Create admin user
                const hashedPassword = bcrypt.hashSync('admin123', 10);
                const admin = await this.prisma.user.create({
                    data: {
                        username: 'admin',
                        email: 'admin@processflow.com',
                        passwordHash: hashedPassword,
                        fullName: 'Admin User',
                        role: 'admin'
                    }
                });

                // Create demo workspace
                const demoWorkspace = await this.prisma.workspace.create({
                    data: {
                        name: 'Demo Workspace',
                        description: 'Demo amaçlı workspace',
                        ownerId: admin.id,
                        isPublic: true
                    }
                });

                // Add admin to workspace as owner
                await this.prisma.workspaceMember.create({
                    data: {
                        workspaceId: demoWorkspace.id,
                        userId: admin.id,
                        role: 'owner'
                    }
                });

                console.log('Initial data created successfully');
            }
        } catch (error) {
            console.error('Error creating initial data:', error);
            throw error;
        }
    }

    // User operations
    async createUser(username, email, password, fullName) {
        try {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const user = await this.prisma.user.create({
                data: {
                    username,
                    email,
                    passwordHash: hashedPassword,
                    fullName
                }
            });
            return { id: user.id, username: user.username, email: user.email, fullName: user.fullName };
        } catch (error) {
            throw new Error('Kullanıcı oluşturulamadı: ' + error.message);
        }
    }

    async getUserByUsername(username) {
        try {
            return await this.prisma.user.findUnique({
                where: { username }
            });
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await this.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullName: true,
                    role: true,
                    createdAt: true
                }
            });
        } catch (error) {
            throw error;
        }
    }

    verifyPassword(user, password) {
        return bcrypt.compareSync(password, user.passwordHash);
    }

    // Workspace operations
    async createWorkspace(name, description, ownerId, isPublic = false) {
        try {
            const workspace = await this.prisma.workspace.create({
                data: {
                    name,
                    description,
                    ownerId,
                    isPublic
                }
            });

            // Add owner to workspace
            await this.prisma.workspaceMember.create({
                data: {
                    workspaceId: workspace.id,
                    userId: ownerId,
                    role: 'owner'
                }
            });

            return { id: workspace.id, name, description, ownerId, isPublic };
        } catch (error) {
            throw new Error('Workspace oluşturulamadı: ' + error.message);
        }
    }

    async getWorkspacesByUser(userId) {
        try {
            return await this.prisma.workspace.findMany({
                where: {
                    members: {
                        some: {
                            userId
                        }
                    }
                },
                include: {
                    members: {
                        where: { userId },
                        select: { role: true }
                    }
                },
                orderBy: { updatedAt: 'desc' }
            }).then(workspaces => 
                workspaces.map(workspace => ({
                    ...workspace,
                    user_role: workspace.members[0]?.role
                }))
            );
        } catch (error) {
            throw error;
        }
    }

    async getWorkspaceById(workspaceId, userId) {
        try {
            const workspace = await this.prisma.workspace.findFirst({
                where: {
                    id: workspaceId,
                    members: {
                        some: {
                            userId
                        }
                    }
                },
                include: {
                    members: {
                        where: { userId },
                        select: { role: true }
                    }
                }
            });

            if (workspace) {
                return {
                    ...workspace,
                    user_role: workspace.members[0]?.role
                };
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    // Process operations
    async createProcess(name, description, workspaceId, createdBy) {
        try {
            const process = await this.prisma.process.create({
                data: {
                    name,
                    description,
                    workspaceId,
                    createdBy
                }
            });
            return { id: process.id, name, description, workspaceId, createdBy };
        } catch (error) {
            throw new Error('Süreç oluşturulamadı: ' + error.message);
        }
    }

    async getProcessesByWorkspace(workspaceId) {
        try {
            return await this.prisma.process.findMany({
                where: { workspaceId },
                include: {
                    creator: {
                        select: { username: true }
                    }
                },
                orderBy: { updatedAt: 'desc' }
            }).then(processes =>
                processes.map(process => ({
                    ...process,
                    created_by_name: process.creator.username
                }))
            );
        } catch (error) {
            throw error;
        }
    }

    async getProcessById(processId) {
        try {
            const process = await this.prisma.process.findUnique({
                where: { id: processId },
                include: {
                    creator: {
                        select: { username: true }
                    }
                }
            });

            if (process) {
                return {
                    ...process,
                    created_by_name: process.creator.username
                };
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    // Process elements operations
    async createProcessElement(processId, elementType, label, xPosition, yPosition, properties = {}) {
        try {
            const element = await this.prisma.processElement.create({
                data: {
                    processId,
                    elementType,
                    label,
                    xPosition,
                    yPosition,
                    properties: JSON.stringify(properties)
                }
            });
            return { 
                id: element.id, 
                processId, 
                elementType, 
                label, 
                xPosition, 
                yPosition, 
                properties 
            };
        } catch (error) {
            throw new Error('Süreç elementi oluşturulamadı: ' + error.message);
        }
    }

    async getProcessElements(processId) {
        try {
            const elements = await this.prisma.processElement.findMany({
                where: { processId },
                orderBy: { createdAt: 'asc' }
            });

            return elements.map(element => ({
                ...element,
                properties: element.properties ? JSON.parse(element.properties) : {}
            }));
        } catch (error) {
            throw error;
        }
    }

    async updateProcessElement(processId, elementId, updateData) {
        try {
            const element = await this.prisma.processElement.updateMany({
                where: {
                    id: elementId,
                    processId
                },
                data: {
                    label: updateData.label,
                    xPosition: updateData.xPosition,
                    yPosition: updateData.yPosition,
                    properties: JSON.stringify(updateData.properties || {})
                }
            });

            if (element.count === 0) {
                throw new Error('Element bulunamadı');
            }

            return await this.prisma.processElement.findUnique({
                where: { id: elementId }
            });
        } catch (error) {
            throw new Error('Element güncellenemedi: ' + error.message);
        }
    }

    async deleteProcessElement(processId, elementId) {
        try {
            // Delete related connections first
            await this.prisma.processConnection.deleteMany({
                where: {
                    processId,
                    OR: [
                        { sourceElementId: elementId },
                        { targetElementId: elementId }
                    ]
                }
            });

            // Delete the element
            const result = await this.prisma.processElement.deleteMany({
                where: {
                    id: elementId,
                    processId
                }
            });

            if (result.count === 0) {
                throw new Error('Element bulunamadı');
            }
        } catch (error) {
            throw new Error('Element silinemedi: ' + error.message);
        }
    }

    async getProcessElementById(elementId) {
        try {
            return await this.prisma.processElement.findUnique({
                where: { id: elementId }
            });
        } catch (error) {
            throw error;
        }
    }

    // Process connections operations
    async createProcessConnection(processId, sourceElementId, targetElementId, label = '', properties = {}) {
        try {
            const connection = await this.prisma.processConnection.create({
                data: {
                    processId,
                    sourceElementId,
                    targetElementId,
                    label,
                    properties: JSON.stringify(properties)
                }
            });
            return { 
                id: connection.id, 
                processId, 
                sourceElementId, 
                targetElementId, 
                label, 
                properties 
            };
        } catch (error) {
            throw new Error('Süreç bağlantısı oluşturulamadı: ' + error.message);
        }
    }

    async getProcessConnections(processId) {
        try {
            const connections = await this.prisma.processConnection.findMany({
                where: { processId },
                orderBy: { createdAt: 'asc' }
            });

            return connections.map(connection => ({
                ...connection,
                properties: connection.properties ? JSON.parse(connection.properties) : {}
            }));
        } catch (error) {
            throw error;
        }
    }

    async deleteProcessConnection(processId, connectionId) {
        try {
            const result = await this.prisma.processConnection.deleteMany({
                where: {
                    id: connectionId,
                    processId
                }
            });

            if (result.count === 0) {
                throw new Error('Bağlantı bulunamadı');
            }
        } catch (error) {
            throw new Error('Bağlantı silinemedi: ' + error.message);
        }
    }

    async close() {
        try {
            await this.prisma.$disconnect();
        } catch (error) {
            console.error('Database connection close error:', error);
        }
    }
}

module.exports = ProcessFlowDatabasePrisma;
