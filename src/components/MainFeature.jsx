import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, addDays } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = ({ 
  activeTab, 
  selectedFarm, 
  crops, 
  setCrops, 
  tasks, 
  setTasks, 
  expenses, 
  setExpenses, 
  mockWeather 
}) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({})

  const resetForm = () => {
    setFormData({})
    setShowAddForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    switch (activeTab) {
      case 'crops':
        const newCrop = {
          id: Date.now().toString(),
          farmId: selectedFarm.id,
          name: formData.name || '',
          variety: formData.variety || '',
          plantedDate: new Date(formData.plantedDate || new Date()),
          expectedHarvestDate: new Date(formData.expectedHarvestDate || addDays(new Date(), 90)),
          status: 'Planted',
          area: parseFloat(formData.area) || 0
        }
        setCrops([...crops, newCrop])
        toast.success(`${newCrop.name} crop added successfully!`)
        break

      case 'tasks':
        const newTask = {
          id: Date.now().toString(),
          farmId: selectedFarm.id,
          cropId: formData.cropId || '',
          title: formData.title || '',
          description: formData.description || '',
          scheduledDate: new Date(formData.scheduledDate || new Date()),
          completed: false,
          priority: formData.priority || 'medium'
        }
        setTasks([...tasks, newTask])
        toast.success(`Task "${newTask.title}" added successfully!`)
        break

      case 'expenses':
        const newExpense = {
          id: Date.now().toString(),
          farmId: selectedFarm.id,
          amount: parseFloat(formData.amount) || 0,
          category: formData.category || '',
          description: formData.description || '',
          date: new Date(formData.date || new Date())
        }
        setExpenses([...expenses, newExpense])
        toast.success(`Expense of $${newExpense.amount} added successfully!`)
        break
    }
    
    resetForm()
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ))
    toast.success('Task status updated!')
  }

  const deleteItem = (id, type) => {
    switch (type) {
      case 'crop':
        setCrops(crops.filter(crop => crop.id !== id))
        toast.success('Crop deleted successfully!')
        break
      case 'task':
        setTasks(tasks.filter(task => task.id !== id))
        toast.success('Task deleted successfully!')
        break
      case 'expense':
        setExpenses(expenses.filter(expense => expense.id !== id))
        toast.success('Expense deleted successfully!')
        break
    }
  }

  const renderCropsContent = () => {
    const farmCrops = crops.filter(crop => crop.farmId === selectedFarm.id)
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Crop Management</h2>
            <p className="text-surface-600 dark:text-surface-400">Track your crops from planting to harvest</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors shadow-soft flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>Add Crop</span>
          </button>
        </div>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700"
          >
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Add New Crop</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Crop Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                  placeholder="e.g., Corn, Tomatoes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Variety</label>
                <input
                  type="text"
                  value={formData.variety || ''}
                  onChange={(e) => handleInputChange('variety', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                  placeholder="e.g., Sweet Corn, Beefsteak"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Planted Date</label>
                <input
                  type="date"
                  value={formData.plantedDate || format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => handleInputChange('plantedDate', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Expected Harvest</label>
                <input
                  type="date"
                  value={formData.expectedHarvestDate || format(addDays(new Date(), 90), 'yyyy-MM-dd')}
                  onChange={(e) => handleInputChange('expectedHarvestDate', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Area (acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.area || ''}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                  placeholder="0.0"
                />
              </div>
              <div className="sm:col-span-2 flex space-x-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
                >
                  Add Crop
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-surface-500 hover:bg-surface-600 text-white font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {farmCrops.map(crop => (
            <motion.div
              key={crop.id}
              layout
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700 hover:shadow-soft transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <ApperIcon name="Wheat" className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-900 dark:text-white">{crop.name}</h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400">{crop.variety}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteItem(crop.id, 'crop')}
                  className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-surface-600 dark:text-surface-400">Status</span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    crop.status === 'Growing' ? 'bg-primary-100 text-primary-800' :
                    crop.status === 'Flowering' ? 'bg-secondary-100 text-secondary-800' :
                    'bg-surface-100 text-surface-800'
                  }`}>
                    {crop.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-surface-600 dark:text-surface-400">Area</span>
                  <span className="text-sm font-medium text-surface-900 dark:text-white">{crop.area} acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-surface-600 dark:text-surface-400">Planted</span>
                  <span className="text-sm font-medium text-surface-900 dark:text-white">{format(crop.plantedDate, 'MMM d')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-surface-600 dark:text-surface-400">Harvest</span>
                  <span className="text-sm font-medium text-surface-900 dark:text-white">{format(crop.expectedHarvestDate, 'MMM d')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  const renderTasksContent = () => {
    const farmTasks = tasks.filter(task => task.farmId === selectedFarm.id)
    const farmCrops = crops.filter(crop => crop.farmId === selectedFarm.id)

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Task Management</h2>
            <p className="text-surface-600 dark:text-surface-400">Schedule and track your farm activities</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors shadow-soft flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700"
          >
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Add New Task</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Task Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                  placeholder="e.g., Water tomato field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Related Crop</label>
                <select
                  value={formData.cropId || ''}
                  onChange={(e) => handleInputChange('cropId', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                >
                  <option value="">Select a crop</option>
                  {farmCrops.map(crop => (
                    <option key={crop.id} value={crop.id}>{crop.name} - {crop.variety}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Priority</label>
                <select
                  value={formData.priority || 'medium'}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Scheduled Date</label>
                <input
                  type="date"
                  value={formData.scheduledDate || format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                  placeholder="Task details..."
                />
              </div>
              <div className="sm:col-span-2 flex space-x-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-surface-500 hover:bg-surface-600 text-white font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="space-y-4">
          {farmTasks.map(task => (
            <motion.div
              key={task.id}
              layout
              className="bg-white dark:bg-surface-800 rounded-2xl p-4 sm:p-6 shadow-card border border-surface-200 dark:border-surface-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed 
                        ? 'bg-primary-500 border-primary-500' 
                        : 'border-surface-300 dark:border-surface-600 hover:border-primary-500'
                    }`}
                  >
                    {task.completed && <ApperIcon name="Check" className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${task.completed ? 'line-through text-surface-500' : 'text-surface-900 dark:text-white'}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400">{task.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-surface-500">
                        {format(task.scheduledDate, 'MMM d, yyyy')}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-secondary-100 text-secondary-800' :
                        'bg-surface-100 text-surface-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteItem(task.id, 'task')}
                  className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  const renderExpensesContent = () => {
    const farmExpenses = expenses.filter(expense => expense.farmId === selectedFarm.id)
    const totalExpenses = farmExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const expensesByCategory = farmExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Expense Tracking</h2>
            <p className="text-surface-600 dark:text-surface-400">Monitor your farm spending and budget</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors shadow-soft flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Total Expenses</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">${totalExpenses}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <ApperIcon name="DollarSign" className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
          
          {Object.entries(expensesByCategory).slice(0, 3).map(([category, amount]) => (
            <div key={category} className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-surface-600 dark:text-surface-400">{category}</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">${amount}</p>
                </div>
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Receipt" className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700"
          >
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Add New Expense</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount || ''}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Category</label>
                <select
                  required
                  value={formData.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                >
                  <option value="">Select category</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Tools">Tools</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Labor">Labor</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date || format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                  placeholder="What was this expense for?"
                />
              </div>
              <div className="sm:col-span-2 flex space-x-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
                >
                  Add Expense
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-surface-500 hover:bg-surface-600 text-white font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="space-y-4">
          {farmExpenses.map(expense => (
            <motion.div
              key={expense.id}
              layout
              className="bg-white dark:bg-surface-800 rounded-2xl p-4 sm:p-6 shadow-card border border-surface-200 dark:border-surface-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                    <ApperIcon name="Receipt" className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-900 dark:text-white">${expense.amount}</h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400">{expense.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-surface-500">
                        {format(expense.date, 'MMM d, yyyy')}
                      </span>
                      <span className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-surface-300 rounded-lg text-xs font-medium">
                        {expense.category}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteItem(expense.id, 'expense')}
                  className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  const renderWeatherContent = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Weather Information</h2>
          <p className="text-surface-600 dark:text-surface-400">Current conditions and forecast for {selectedFarm.location}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Weather */}
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-6 sm:p-8 text-white shadow-card">
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ApperIcon name="Sun" className="w-12 h-12 sm:w-14 sm:h-14" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-2">{mockWeather.temperature}°F</h3>
              <p className="text-lg mb-1">{mockWeather.condition}</p>
              <p className="text-sm opacity-80">Humidity: {mockWeather.humidity}%</p>
            </div>
          </div>

          {/* 3-Day Forecast */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">3-Day Forecast</h3>
            <div className="space-y-4">
              {mockWeather.forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                      <ApperIcon 
                        name={day.condition === 'Rain' ? 'CloudRain' : day.condition === 'Cloudy' ? 'Cloud' : 'Sun'} 
                        className="w-5 h-5 text-secondary-600 dark:text-secondary-400" 
                      />
                    </div>
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">{day.day}</p>
                      <p className="text-sm text-surface-600 dark:text-surface-400">{day.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-surface-900 dark:text-white">{day.temp}°F</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        <div className="bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/50 rounded-lg flex items-center justify-center mt-1">
              <ApperIcon name="AlertTriangle" className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Weather Advisory</h4>
              <p className="text-secondary-800 dark:text-secondary-200 text-sm">
                Rain expected Wednesday. Consider covering sensitive crops and adjusting watering schedules accordingly.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Weather-Based Recommendations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
              <div className="flex items-center space-x-3 mb-2">
                <ApperIcon name="Droplets" className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h4 className="font-medium text-primary-900 dark:text-primary-100">Irrigation</h4>
              </div>
              <p className="text-sm text-primary-800 dark:text-primary-200">
                Good conditions for watering today. Rain expected Wednesday may reduce irrigation needs.
              </p>
            </div>
            
            <div className="p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-xl border border-secondary-200 dark:border-secondary-800">
              <div className="flex items-center space-x-3 mb-2">
                <ApperIcon name="Sprout" className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                <h4 className="font-medium text-secondary-900 dark:text-secondary-100">Planting</h4>
              </div>
              <p className="text-sm text-secondary-800 dark:text-secondary-200">
                Excellent conditions for outdoor planting. Temperature and humidity levels are optimal.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'crops':
        return renderCropsContent()
      case 'tasks':
        return renderTasksContent()
      case 'expenses':
        return renderExpensesContent()
      case 'weather':
        return renderWeatherContent()
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {renderContent()}
    </div>
  )
}

export default MainFeature