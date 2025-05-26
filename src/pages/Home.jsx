import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import { format, addDays, isToday, isTomorrow } from 'date-fns'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [farms, setFarms] = useState([
    { id: '1', name: 'North Field Farm', location: 'Valley Ridge', size: 150, crops: 3, tasks: 5 }
  ])
  const [selectedFarm, setSelectedFarm] = useState(farms[0])
  const [crops, setCrops] = useState([
    { id: '1', farmId: '1', name: 'Corn', variety: 'Sweet Corn', plantedDate: new Date('2024-03-15'), expectedHarvestDate: new Date('2024-08-15'), status: 'Growing', area: 50 },
    { id: '2', farmId: '1', name: 'Tomatoes', variety: 'Beefsteak', plantedDate: new Date('2024-04-01'), expectedHarvestDate: new Date('2024-07-15'), status: 'Flowering', area: 25 }
  ])
  const [tasks, setTasks] = useState([
    { id: '1', farmId: '1', cropId: '1', title: 'Water Corn Field', description: 'Deep watering needed', scheduledDate: new Date(), completed: false, priority: 'high' },
    { id: '2', farmId: '1', cropId: '2', title: 'Harvest Tomatoes', description: 'Pick ripe tomatoes', scheduledDate: addDays(new Date(), 1), completed: false, priority: 'medium' },
    { id: '3', farmId: '1', cropId: '1', title: 'Apply Fertilizer', description: 'Nitrogen fertilizer application', scheduledDate: addDays(new Date(), 3), completed: true, priority: 'low' }
  ])
  const [expenses, setExpenses] = useState([
    { id: '1', farmId: '1', amount: 450, category: 'Seeds', description: 'Corn seeds for spring planting', date: new Date('2024-03-10') },
    { id: '2', farmId: '1', amount: 120, category: 'Fertilizer', description: 'Organic fertilizer', date: new Date('2024-03-20') },
    { id: '3', farmId: '1', amount: 75, category: 'Tools', description: 'New garden hose', date: new Date('2024-04-05') }
  ])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const getTaskStatusColor = (task) => {
    if (task.completed) return 'text-primary-600'
    if (isToday(task.scheduledDate)) return 'text-red-600'
    if (isTomorrow(task.scheduledDate)) return 'text-secondary-600'
    return 'text-surface-600'
  }

  const getTaskPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-secondary-100 text-secondary-800'
      case 'low': return 'bg-surface-100 text-surface-800'
      default: return 'bg-surface-100 text-surface-800'
    }
  }

  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ))
    toast.success('Task status updated!')
  }

  const upcomingTasks = tasks.filter(task => !task.completed && task.farmId === selectedFarm.id)
  const todayTasks = upcomingTasks.filter(task => isToday(task.scheduledDate))
  const totalExpenses = expenses.filter(expense => expense.farmId === selectedFarm.id).reduce((sum, expense) => sum + expense.amount, 0)

  const mockWeather = {
    temperature: 72,
    humidity: 65,
    condition: 'Partly Cloudy',
    forecast: [
      { day: 'Today', temp: 72, condition: 'Sunny' },
      { day: 'Tomorrow', temp: 75, condition: 'Cloudy' },
      { day: 'Wednesday', temp: 68, condition: 'Rain' }
    ]
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 min-h-screen">
        {/* Header */}
        <header className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
                  <ApperIcon name="Wheat" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">CropKeeper</h1>
                  <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 hidden sm:block">Farm Management Platform</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <select 
                  value={selectedFarm.id}
                  onChange={(e) => setSelectedFarm(farms.find(f => f.id === e.target.value))}
                  className="px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  {farms.map(farm => (
                    <option key={farm.id} value={farm.id}>{farm.name}</option>
                  ))}
                </select>
                
                <button
                  onClick={toggleDarkMode}
                  className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                >
                  <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide pb-4">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
                { id: 'crops', label: 'Crops', icon: 'Wheat' },
                { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' },
                { id: 'expenses', label: 'Expenses', icon: 'DollarSign' },
                { id: 'weather', label: 'Weather', icon: 'Cloud' },
                { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-soft'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name={tab.icon} className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 sm:space-y-8"
              >
                {/* Farm Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 sm:p-6 shadow-card border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-surface-600 dark:text-surface-400">Total Crops</p>
                        <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">{crops.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                        <ApperIcon name="Wheat" className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 sm:p-6 shadow-card border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-surface-600 dark:text-surface-400">Today's Tasks</p>
                        <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">{todayTasks.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl flex items-center justify-center">
                        <ApperIcon name="CheckSquare" className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 sm:p-6 shadow-card border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-surface-600 dark:text-surface-400">Total Expenses</p>
                        <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">${totalExpenses}</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                        <ApperIcon name="DollarSign" className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 sm:p-6 shadow-card border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-surface-600 dark:text-surface-400">Farm Size</p>
                        <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">{selectedFarm.size} acres</p>
                      </div>
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                        <ApperIcon name="MapPin" className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Tasks and Weather */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                  <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 sm:p-6 shadow-card border border-surface-200 dark:border-surface-700">
                      <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-white mb-4 sm:mb-6">Upcoming Tasks</h3>
                      <div className="space-y-3 sm:space-y-4">
                        {upcomingTasks.slice(0, 5).map(task => (
                          <div key={task.id} className="flex items-center justify-between p-3 sm:p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <button
                                onClick={() => toggleTaskComplete(task.id)}
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  task.completed 
                                    ? 'bg-primary-500 border-primary-500' 
                                    : 'border-surface-300 dark:border-surface-600 hover:border-primary-500'
                                }`}
                              >
                                {task.completed && <ApperIcon name="Check" className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                              </button>
                              <div className="flex-1">
                                <p className={`font-medium text-sm sm:text-base ${getTaskStatusColor(task)} dark:text-white`}>
                                  {task.title}
                                </p>
                                <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
                                  {format(task.scheduledDate, 'MMM d')} • {task.description}
                                </p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getTaskPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 sm:p-6 shadow-card border border-surface-200 dark:border-surface-700">
                    <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-white mb-4 sm:mb-6">Weather</h3>
                    <div className="text-center mb-4 sm:mb-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                        <ApperIcon name="Sun" className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <p className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white">{mockWeather.temperature}°F</p>
                      <p className="text-sm text-surface-600 dark:text-surface-400">{mockWeather.condition}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-500">Humidity: {mockWeather.humidity}%</p>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {mockWeather.forecast.map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                          <span className="text-sm font-medium text-surface-900 dark:text-white">{day.day}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-surface-600 dark:text-surface-400">{day.condition}</span>
                            <span className="text-sm font-medium text-surface-900 dark:text-white">{day.temp}°</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {(activeTab === 'crops' || activeTab === 'tasks' || activeTab === 'expenses' || activeTab === 'weather' || activeTab === 'analytics') && (

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <MainFeature 
                  activeTab={activeTab}
                  selectedFarm={selectedFarm}
                  crops={crops}
                  setCrops={setCrops}
                  tasks={tasks}
                  setTasks={setTasks}
                  expenses={expenses}
                  setExpenses={setExpenses}
                  mockWeather={mockWeather}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default Home