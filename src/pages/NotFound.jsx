import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-8 flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-6xl font-bold text-surface-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-surface-800 dark:text-surface-200 mb-4">Page Not Found</h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Sorry, the page you're looking for doesn't exist. Let's get you back to your farm.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors shadow-soft"
        >
          <ApperIcon name="Home" className="w-5 h-5 mr-2" />
          Back to Farm
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound