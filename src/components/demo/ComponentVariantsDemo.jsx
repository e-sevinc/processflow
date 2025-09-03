import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SimpleSelect, SelectOption } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle,
  Star,
  Heart,
  ThumbsUp
} from 'lucide-react'

export const ComponentVariantsDemo = () => {
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [switchValue, setSwitchValue] = useState(false)
  const [cardLoading, setCardLoading] = useState(false)

  const handleLoadingDemo = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 3000)
  }

  const handleCardLoadingDemo = () => {
    setCardLoading(true)
    setTimeout(() => setCardLoading(false), 3000)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Component Variants Demo</h1>
        <p className="text-gray-600">Enhanced UI components with loading states, hover effects, and disabled states</p>
      </div>

      {/* Button Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>Buttons with loading states, hover effects, and different variants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="default" loading={loading} onClick={handleLoadingDemo}>
              Default
            </Button>
            <Button variant="secondary" loading={loading}>
              Secondary
            </Button>
            <Button variant="outline" loading={loading}>
              Outline
            </Button>
            <Button variant="destructive" loading={loading}>
              Destructive
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="ghost" loading={loading}>
              Ghost
            </Button>
            <Button variant="link" loading={loading}>
              Link
            </Button>
            <Button disabled>
              Disabled
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button size="sm" loading={loading}>
              Small
            </Button>
            <Button size="default" loading={loading}>
              Default
            </Button>
            <Button size="lg" loading={loading}>
              Large
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>Enhanced form components with loading states and better interactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="demo-input">Input with Loading</Label>
              <Input
                id="demo-input"
                placeholder="Type something..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                loading={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="demo-select">Select with Loading</Label>
              <SimpleSelect
                id="demo-select"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                loading={loading}
              >
                <SelectOption value="">Choose an option</SelectOption>
                <SelectOption value="option1">Option 1</SelectOption>
                <SelectOption value="option2">Option 2</SelectOption>
                <SelectOption value="option3">Option 3</SelectOption>
              </SimpleSelect>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-textarea">Textarea with Loading</Label>
            <Textarea
              id="demo-textarea"
              placeholder="Enter your message..."
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              loading={loading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={switchValue}
              onCheckedChange={setSwitchValue}
              disabled={loading}
            />
            <Label>Switch with disabled state</Label>
          </div>
        </CardContent>
      </Card>

      {/* Badge Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Variants</CardTitle>
          <CardDescription>Enhanced badges with different variants and sizes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge size="sm">Small</Badge>
              <Badge size="default">Default</Badge>
              <Badge size="lg">Large</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Completed
              </Badge>
              <Badge variant="warning" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Warning
              </Badge>
              <Badge variant="info" className="flex items-center gap-1">
                <Info className="h-3 w-3" />
                Information
              </Badge>
              <Badge variant="destructive" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Error
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card with Loading State */}
      <Card loading={cardLoading}>
        <CardHeader>
          <CardTitle>Card with Loading State</CardTitle>
          <CardDescription>This card demonstrates the loading overlay functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            This card shows how loading states can be applied to entire components.
            Click the button below to see the loading overlay in action.
          </p>
          <div className="flex items-center gap-2">
            <Button onClick={handleCardLoadingDemo} loading={cardLoading}>
              {cardLoading ? 'Loading...' : 'Trigger Card Loading'}
            </Button>
            <Badge variant={cardLoading ? 'warning' : 'success'}>
              {cardLoading ? 'Loading' : 'Ready'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Demo</CardTitle>
          <CardDescription>Try different combinations of states and variants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Form with Loading States</Label>
              <div className="space-y-2">
                <Input placeholder="Username" loading={loading} />
                <Input placeholder="Email" loading={loading} />
                <Button className="w-full" loading={loading} onClick={handleLoadingDemo}>
                  Submit Form
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status Indicators</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Process Status</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>User Count</span>
                  <Badge variant="info">1,234</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Updated</span>
                  <Badge variant="secondary">2 min ago</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
