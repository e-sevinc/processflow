import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, Clock, Users, TrendingUp, AlertTriangle, 
  CheckCircle, XCircle, Activity, Target
} from 'lucide-react'

export const ProcessAnalytics = ({ processId }) => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [processId])

  const loadAnalytics = async () => {
    try {
      // Mock data - gerçek uygulamada API'den gelecek
      const mockAnalytics = {
        totalSteps: 12,
        averageTime: '2.5 saat',
        completionRate: 85,
        bottlenecks: [
          { step: 'Onay Süreci', time: '4.2 saat', impact: 'high' },
          { step: 'Doküman Hazırlama', time: '3.1 saat', impact: 'medium' }
        ],
        performance: {
          excellent: 3,
          good: 5,
          average: 3,
          poor: 1
        },
        recentActivity: [
          { type: 'completed', step: 'Başvuru Formu', time: '2 saat önce' },
          { type: 'started', step: 'Doküman Kontrolü', time: '1 saat önce' }
        ]
      }
      
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Analitik yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center text-gray-500">
        Analitik verisi bulunamadı
      </div>
    )
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Genel Metrikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Adım</p>
                <p className="text-2xl font-bold">{analytics.totalSteps}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Süre</p>
                <p className="text-2xl font-bold">{analytics.averageTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tamamlanma Oranı</p>
                <p className="text-2xl font-bold">{analytics.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Darboğaz Analizi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Darboğaz Analizi</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.bottlenecks.map((bottleneck, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{bottleneck.step}</p>
                  <p className="text-sm text-gray-600">Ortalama süre: {bottleneck.time}</p>
                </div>
                <Badge className={getImpactColor(bottleneck.impact)}>
                  {bottleneck.impact === 'high' ? 'Yüksek' : 
                   bottleneck.impact === 'medium' ? 'Orta' : 'Düşük'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performans Dağılımı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Performans Dağılımı</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Mükemmel</span>
                </span>
                <Badge variant="outline">{analytics.performance.excellent}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span>İyi</span>
                </span>
                <Badge variant="outline">{analytics.performance.good}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span>Orta</span>
                </span>
                <Badge variant="outline">{analytics.performance.average}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span>Zayıf</span>
                </span>
                <Badge variant="outline">{analytics.performance.poor}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Son Aktiviteler */}
        <Card>
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.step}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type === 'completed' ? 'Tamamlandı' : 'Başladı'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aksiyon Butonları */}
      <div className="flex space-x-3">
        <Button variant="outline">
          <BarChart3 className="h-4 w-4 mr-2" />
          Detaylı Rapor
        </Button>
        <Button variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          İyileştirme Önerileri
        </Button>
        <Button>
          <Activity className="h-4 w-4 mr-2" />
          Simülasyon Başlat
        </Button>
      </div>
    </div>
  )
} 