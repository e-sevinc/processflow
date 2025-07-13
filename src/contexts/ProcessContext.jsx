import { createContext, useContext, useState, useReducer, useCallback } from 'react'
import apiService from '@/services/api'

const ProcessContext = createContext()

// Action types
const ACTIONS = {
  SET_ELEMENTS: 'SET_ELEMENTS',
  ADD_ELEMENT: 'ADD_ELEMENT',
  UPDATE_ELEMENT: 'UPDATE_ELEMENT',
  DELETE_ELEMENT: 'DELETE_ELEMENT',
  SET_CONNECTIONS: 'SET_CONNECTIONS',
  ADD_CONNECTION: 'ADD_CONNECTION',
  DELETE_CONNECTION: 'DELETE_CONNECTION',
  SET_SELECTED: 'SET_SELECTED',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
}

// Reducer
const processReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_ELEMENTS:
      return { ...state, elements: action.payload }
    case ACTIONS.ADD_ELEMENT:
      return { ...state, elements: [...state.elements, action.payload] }
    case ACTIONS.UPDATE_ELEMENT:
      return {
        ...state,
        elements: state.elements.map(el =>
          el.id === action.payload.id ? action.payload : el
        )
      }
    case ACTIONS.DELETE_ELEMENT:
      return {
        ...state,
        elements: state.elements.filter(el => el.id !== action.payload),
        connections: state.connections.filter(
          conn => conn.from !== action.payload && conn.to !== action.payload
        )
      }
    case ACTIONS.SET_CONNECTIONS:
      return { ...state, connections: action.payload }
    case ACTIONS.ADD_CONNECTION:
      return { ...state, connections: [...state.connections, action.payload] }
    case ACTIONS.DELETE_CONNECTION:
      return {
        ...state,
        connections: state.connections.filter(conn => conn.id !== action.payload)
      }
    case ACTIONS.SET_SELECTED:
      return { ...state, selectedElement: action.payload }
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export const useProcess = () => {
  const context = useContext(ProcessContext)
  if (!context) {
    throw new Error('useProcess must be used within a ProcessProvider')
  }
  return context
}

export const ProcessProvider = ({ children }) => {
  const [state, dispatch] = useReducer(processReducer, {
    elements: [],
    connections: [],
    selectedElement: null,
    loading: false,
    error: null
  })

  // Actions
  const loadProcess = useCallback(async (processId) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true })
    try {
      const response = await apiService.getProcess(processId)
      dispatch({ type: ACTIONS.SET_ELEMENTS, payload: response.elements || [] })
      dispatch({ type: ACTIONS.SET_CONNECTIONS, payload: response.connections || [] })
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false })
    }
  }, [])

  const addElement = useCallback(async (processId, elementData) => {
    try {
      const response = await apiService.createProcessElement(processId, elementData)
      dispatch({ type: ACTIONS.ADD_ELEMENT, payload: response.element })
      return response.element
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
      throw error
    }
  }, [])

  const updateElement = useCallback(async (processId, elementId, elementData) => {
    try {
      await apiService.updateProcessElement(processId, elementId, elementData)
      dispatch({ type: ACTIONS.UPDATE_ELEMENT, payload: { id: elementId, ...elementData } })
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
      throw error
    }
  }, [])

  const deleteElement = useCallback(async (processId, elementId) => {
    try {
      await apiService.deleteProcessElement(processId, elementId)
      dispatch({ type: ACTIONS.DELETE_ELEMENT, payload: elementId })
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
      throw error
    }
  }, [])

  const addConnection = useCallback(async (processId, connectionData) => {
    try {
      const response = await apiService.createProcessConnection(processId, connectionData)
      dispatch({ type: ACTIONS.ADD_CONNECTION, payload: response.connection })
      return response.connection
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
      throw error
    }
  }, [])

  const deleteConnection = useCallback(async (processId, connectionId) => {
    try {
      await apiService.deleteProcessConnection(processId, connectionId)
      dispatch({ type: ACTIONS.DELETE_CONNECTION, payload: connectionId })
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
      throw error
    }
  }, [])

  const setSelectedElement = useCallback((element) => {
    dispatch({ type: ACTIONS.SET_SELECTED, payload: element })
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: null })
  }, [])

  const value = {
    ...state,
    loadProcess,
    addElement,
    updateElement,
    deleteElement,
    addConnection,
    deleteConnection,
    setSelectedElement,
    clearError
  }

  return (
    <ProcessContext.Provider value={value}>
      {children}
    </ProcessContext.Provider>
  )
} 