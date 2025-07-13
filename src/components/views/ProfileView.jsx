import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  X,
  Camera,
  Award,
  Clock,
  Target,
  Activity
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

export const ProfileView = ({ onNavigate }) => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editMode, setEditMode] = useState('')
  
  // Profile data
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || 'Admin User',
    email: user?.email || 'admin@processflow.com',
    phone: '+90 555 123 4567',
    location: 'İstanbul, Türkiye',
    position: 'Süreç Yöneticisi',
    department: 'Operasyonlar',
    bio: 'Süreç iyileştirme ve optimizasyon konularında 5+ yıl deneyime sahibim. Takım liderliği ve proje yönetimi alanlarında uzmanlaşmış durumdayım.',
    skills: ['Süreç Analizi', 'Proje Yönetimi', 'Takım Liderliği', 'Lean Six Sigma', 'BPMN'],
    joinDate: '2023-01-15',
    lastActive: '2024-01-15 14:30'
  })
  
  // Stats
  const stats = {
    processesCreated: 24,
    processesCompleted: 156,
    teamMembers: 8,
    efficiency: 92
  }
  
  // Recent activities
  const recentActivities = [
    { id: 1, type: 'process_created', title: 'Yeni Satış Süreci oluşturuldu', time: '2 saat önce' },
    { id: 2, type: 'process_completed', title: 'Müşteri Onboarding süreci tamamlandı', time: '1 gün önce' },
    { id: 3, type: 'team_joined', title: 'Yeni takım üyesi eklendi: Ahmet Yılmaz', time: '3 gün önce' },
    { id: 4, type: 'process_updated', title: 'İK Süreçleri güncellendi', time: '1 hafta önce' }
  ]
  
  const handleSave = () => {
    setIsEditing(false)
    setEditMode('')
    // TODO: Implement save functionality
    console.log('Profile saved:', profileData)
  }
  
  const handleCancel = () => {
    setIsEditing(false)
    setEditMode('')
    // Reset to original data
    setProfileData({
      fullName: user?.fullName || 'Admin User',
      email: user?.email || 'admin@processflow.com',
      phone: '+90 555 123 4567',
      location: 'İstanbul, Türkiye',
      position: 'Süreç Yöneticisi',
      department: 'Operasyonlar',
      bio: 'Süreç iyileştirme ve optimizasyon konularında 5+ yıl deneyime sahibim. Takım liderliği ve proje yönetimi alanlarında uzmanlaşmış durumdayım.',
      skills: ['Süreç Analizi', 'Proje Yönetimi', 'Takım Liderliği', 'Lean Six Sigma', 'BPMN'],
      joinDate: '2023-01-15',
      lastActive: '2024-01-15 14:30'
    })
  }
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'process_created': return <Target className="h-4 w-4 text-blue-500" />
      case 'process_completed': return <Award className="h-4 w-4 text-green-500" />
      case 'team_joined': return <User className="h-4 w-4 text-purple-500" />
      case 'process_updated': return <Activity className="h-4 w-4 text-orange-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil</h1>
        <p className="text-gray-600">Kişisel bilgilerinizi ve aktivitelerinizi görüntüleyin</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profil Bilgileri</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2"
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {isEditing ? 'İptal' : 'Düzenle'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" alt={profileData.fullName} />
                    <AvatarFallback className="text-lg">
                      {profileData.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  {isEditing ? (
                    <Input
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="text-xl font-semibold"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold">{profileData.fullName}</h2>
                  )}
                  <p className="text-gray-600">{profileData.position} • {profileData.department}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Katılım: {profileData.joinDate}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-posta
                  </Label>
                  {isEditing ? (
                    <Input
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm">{profileData.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefon
                  </Label>
                  {isEditing ? (
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm">{profileData.phone}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Konum
                  </Label>
                  {isEditing ? (
                    <Input
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm">{profileData.location}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Pozisyon
                  </Label>
                  {isEditing ? (
                    <Input
                      value={profileData.position}
                      onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm">{profileData.position}</p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              {/* Bio */}
              <div className="space-y-2">
                <Label>Hakkımda</Label>
                {isEditing ? (
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{profileData.bio}</p>
                )}
              </div>
              
              {/* Skills */}
              <div className="space-y-2">
                <Label>Yetenekler</Label>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {isEditing && (
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Kaydet
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    İptal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
              <CardDescription>
                Son zamanlardaki aktiviteleriniz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="p-2 rounded-full bg-gray-100">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>İstatistikler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Oluşturulan Süreçler</span>
                <Badge variant="outline">{stats.processesCreated}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tamamlanan Süreçler</span>
                <Badge variant="outline">{stats.processesCompleted}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Takım Üyeleri</span>
                <Badge variant="outline">{stats.teamMembers}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Verimlilik</span>
                <Badge variant="default">%{stats.efficiency}</Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('workspaces')}>
                <User className="h-4 w-4 mr-2" />
                Çalışma Alanları
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('templates')}>
                <Target className="h-4 w-4 mr-2" />
                Şablonlar
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('analytics')}>
                <Activity className="h-4 w-4 mr-2" />
                Analitik
              </Button>
            </CardContent>
          </Card>
          
          {/* Last Active */}
          <Card>
            <CardHeader>
              <CardTitle>Son Aktiflik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{profileData.lastActive}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 