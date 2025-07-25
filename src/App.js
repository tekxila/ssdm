import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Database, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Globe,
  Clock,
  TrendingUp,
  Download,
  User,
  Upload,
  FileText,
  Eye,
  AlertCircle,
  Loader,
  Crown,
  Gem,
  Play,
  Save,
  Code,
  Layers,
  GitBranch,
  Workflow,
  ChevronRight,
  Plus,
  Filter,
  Search,
  RefreshCw,
  FolderPlus,
  Trash2,
  Check
} from 'lucide-react';

//import Mermaid from "react-mermaid2";
import MermaidChart from "./mermaidChart.js";

// Mock Supabase Configuration
const SUPABASE_CONFIG = {
  url: 'https://your-project-ref.supabase.co',
  anonKey: 'your-anon-key-here'
};

// User Tiers
const USER_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
  ULTIMATE: 'ultimate'
};

// Mock Claude responses for conceptual models
const MOCK_CONCEPTUAL_MODELS = [
  {
    id: 'concept_1',
    name: 'Customer-Centric E-commerce Model',
    description: 'Focus on customer relationships and order management',
    entities: ['Customer', 'Order', 'Product', 'Payment'],
    complexity: 'Medium',
    mermaidCode: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--o{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : ordered
    CUSTOMER ||--o{ PAYMENT : makes
    ORDER ||--|| PAYMENT : paid_by`
  },
  {
    id: 'concept_2', 
    name: 'Product-Inventory Focused Model',
    description: 'Emphasizes inventory and product catalog management',
    entities: ['Product', 'Category', 'Inventory', 'Supplier', 'Order'],
    complexity: 'High',
    mermaidCode: `erDiagram
    CATEGORY ||--o{ PRODUCT : contains
    PRODUCT ||--|| INVENTORY : tracked_in
    SUPPLIER ||--o{ PRODUCT : supplies
    PRODUCT ||--o{ ORDER_ITEM : ordered
    ORDER ||--o{ ORDER_ITEM : contains`
  },
  {
    id: 'concept_3',
    name: 'Simplified Transaction Model',
    description: 'Streamlined approach focusing on core transactions',
    entities: ['User', 'Transaction', 'Item'],
    complexity: 'Low',
    mermaidCode: `erDiagram
    USER ||--o{ TRANSACTION : creates
    TRANSACTION ||--o{ TRANSACTION_ITEM : includes
    ITEM ||--o{ TRANSACTION_ITEM : sold_as`
  }
];

// Mock logical model
const MOCK_LOGICAL_MODEL = {
  mermaidCode: `erDiagram
    customers {
        int customer_id PK
        varchar email UK
        varchar first_name
        varchar last_name
        timestamp created_at
        timestamp updated_at
    }
    orders {
        int order_id PK
        int customer_id FK
        decimal total_amount
        varchar status
        timestamp order_date
        timestamp updated_at
    }
    products {
        int product_id PK
        varchar name
        text description
        decimal price
        int stock_quantity
        timestamp created_at
    }
    order_items {
        int order_item_id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
    }
    customers ||--o{ orders : places
    orders ||--o{ order_items : contains
    products ||--o{ order_items : ordered`
};

// Mock physical model
const MOCK_PHYSICAL_MODEL = {
  sqlCode: `-- Physical Database Schema
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);`
};
// Mock physical model
const MOCK_PHYSICAL_DIAGRAMS = {
  sqlCode: `-- Physical Database Schema
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);`
};

const MOCK_ETL_PROCESSES = {
  concept_1: {
    customer_id: {
      extractSource: 'CRM System API',
      transformRules: ['Generate sequential ID', 'Validate uniqueness'],
      loadTarget: 'PostgreSQL customers table',
      bonoboCode: `import bonobo
from bonobo import Graph

def extract_customers():
    yield from crm_api.get_customers()

def transform_customer_id(customer):
    customer['customer_id'] = generate_id()
    return customer

def load_to_db(customer):
    db.customers.insert(customer)

graph = Graph()
graph.add_chain(
    extract_customers,
    transform_customer_id,
    load_to_db
)`
    },
    email: {
      extractSource: 'User Registration Forms',
      transformRules: ['Validate email format', 'Convert to lowercase', 'Check duplicates'],
      loadTarget: 'PostgreSQL customers table',
      bonoboCode: `import bonobo
import re

def validate_email(customer):
    email = customer.get('email', '').lower().strip()
    if re.match(r'^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$', email):
        customer['email'] = email
        return customer
    else:
        raise ValueError(f"Invalid email: {email}")

graph = Graph()
graph.add_chain(
    extract_customers,
    validate_email,
    load_to_db
)`
    }
  }
};

// Mock ETL code
const MOCK_ETL_CODE = `import bonobo
from bonobo.contrib.sqlalchemy import begin

# ETL Pipeline for Data Modeling Project
def extract():
    """Extract data from source systems"""
    # Extract customer data
    yield {'table': 'customers', 'action': 'extract'}
    
def transform_customers(row):
    """Transform customer data"""
    # Data validation and cleaning
    if row.get('email'):
        row['email'] = row['email'].lower().strip()
    return row

def load_to_warehouse(row):
    """Load transformed data to warehouse"""
    # Load to target system
    print(f"Loading {row}")

# Define the ETL graph
graph = bonobo.Graph(
    extract,
    transform_customers,
    load_to_warehouse,
)

if __name__ == '__main__':
    bonobo.run(graph)`;

// Simulated Supabase Client
class SupabaseClient {
  constructor() {
    this.user = null;
    this.authToken = null;
    this.listeners = [];
    this.initializeAuth();
  }

  async initializeAuth() {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_data');
    
    if (token && userStr) {
      this.authToken = token;
      this.user = JSON.parse(userStr);
    }
  }

  async signUp(email, password) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser = {
      id: `user_${Date.now()}`,
      email: email,
      user_metadata: {
        full_name: email.split('@')[0],
        tier: USER_TIERS.FREE
      },
      app_metadata: { provider: 'email' }
    };
    
    this.user = mockUser;
    this.authToken = `token_${Date.now()}`;
    localStorage.setItem('auth_token', this.authToken);
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    
    this.notifyListeners('SIGNED_IN', mockUser);
    return { data: { user: mockUser }, error: null };
  }

  async signInWithPassword(email, password) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const tier = email.includes('premium') ? USER_TIERS.PREMIUM : 
                 email.includes('ultimate') ? USER_TIERS.ULTIMATE : 
                 USER_TIERS.FREE;
    
    const mockUser = {
      id: `user_${Date.now()}`,
      email: email,
      user_metadata: {
        full_name: email.split('@')[0],
        tier: tier
      },
      app_metadata: { provider: 'email' }
    };
    
    this.user = mockUser;
    this.authToken = `token_${Date.now()}`;
    localStorage.setItem('auth_token', this.authToken);
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    
    this.notifyListeners('SIGNED_IN', mockUser);
    return { data: { user: mockUser }, error: null };
  }

  async signOut() {
    this.user = null;
    this.authToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.notifyListeners('SIGNED_OUT', null);
    return { error: null };
  }

  onAuthStateChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners(event, session) {
    this.listeners.forEach(callback => callback(event, session));
  }

  async getSession() {
    return this.user ? { access_token: this.authToken, user: this.user } : null;
  }
}

const supabase = new SupabaseClient();

// Router Context
const RouterContext = createContext();

const RouterProvider = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState('/');
  
  const navigate = (to) => {
    setCurrentRoute(to);
    window.history.pushState({}, '', to);
  };
  
  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const session = await supabase.getSession();
      if (session) {
        setUser(session.user);
      }
      setLoading(false);
    };

    initAuth();

    const unsubscribe = supabase.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.signInWithPassword(email, password);
    return { data, error };
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.signUp(email, password);
    return { data, error };
  };

  const signOut = async () => {
    await supabase.signOut();
  };

  const getUserTier = () => {
    return user?.user_metadata?.tier || USER_TIERS.FREE;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
      getUserTier
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Navigation Component
const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, signOut, user } = useContext(AuthContext);
  const { currentRoute, navigate } = useContext(RouterContext);

  const getTierIcon = (tier) => {
    switch (tier) {
      case USER_TIERS.PREMIUM: return <Crown className="h-4 w-4 text-yellow-500" />;
      case USER_TIERS.ULTIMATE: return <Gem className="h-4 w-4 text-purple-500" />;
      default: return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case USER_TIERS.PREMIUM: return 'text-yellow-600';
      case USER_TIERS.ULTIMATE: return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <nav className="bg-[#0E073D] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Database className="h-8 w-8 text-[#FFCD00]" />
            <span className="text-xl font-bold">DataMind AI</span>
          </button>
          
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/')}
                  className={`hover:text-[#FFCD00] transition-colors ${
                    currentRoute === '/' ? 'text-[#FFCD00]' : ''
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/features')}
                  className={`hover:text-[#FFCD00] transition-colors ${
                    currentRoute === '/features' ? 'text-[#FFCD00]' : ''
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className={`hover:text-[#FFCD00] transition-colors ${
                    currentRoute === '/pricing' ? 'text-[#FFCD00]' : ''
                  }`}
                >
                  Pricing
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-[#FFCD00] text-[#0E073D] px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`hover:text-[#FFCD00] transition-colors ${
                    currentRoute === '/dashboard' ? 'text-[#FFCD00]' : ''
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/modeler')}
                  className={`hover:text-[#FFCD00] transition-colors ${
                    currentRoute === '/modeler' ? 'text-[#FFCD00]' : ''
                  }`}
                >
                  Data Modeler
                </button>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full">
                    {getTierIcon(user?.user_metadata?.tier)}
                    <span className={`text-xs font-medium ${getTierColor(user?.user_metadata?.tier)}`}>
                      {user?.user_metadata?.tier?.toUpperCase() || 'FREE'}
                    </span>
                  </div>
                  <button
                    onClick={signOut}
                    className="flex items-center space-x-1 hover:text-[#FFCD00] transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-[#FFCD00]"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Home Page
const HomePage = () => {
  const { navigate } = useContext(RouterContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E073D] to-purple-900">
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            AI-Powered
            <span className="text-[#FFCD00] block">Data Modeling</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your data into intelligent models with AI-driven insights. 
            Create, visualize, and optimize data architectures effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-[#FFCD00] text-[#0E073D] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/features')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-[#0E073D] transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Features Page
const FeaturesPage = () => {
  const features = [
    {
      tier: 'FREE',
      icon: Star,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      features: [
        'View AI-generated data model diagrams',
        'Basic mermaid diagram export',
        'Community support'
      ]
    },
    {
      tier: 'PREMIUM',
      icon: Crown,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      features: [
        'All FREE features',
        'View 3 conceptual diagram options',
        'Choose and customize 1 model',
        'Logical diagram generation',
        'Save models to database',
        'Priority support'
      ]
    },
    {
      tier: 'ULTIMATE',
      icon: Gem,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      features: [
        'All PREMIUM features',
        'Bonobo ETL code generation',
        'Advanced data transformation',
        'Custom pipeline templates',
        'Enterprise integrations',
        'Dedicated account manager'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#0E073D] mb-4">Choose Your Data Modeling Journey</h1>
          <p className="text-xl text-gray-600">Unlock powerful features based on your needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((tier, index) => (
            <div key={index} className={`p-8 rounded-xl ${tier.bgColor} border-2 border-transparent hover:border-[#FFCD00] transition-all`}>
              <div className="text-center mb-6">
                <tier.icon className={`h-12 w-12 ${tier.color} mx-auto mb-4`} />
                <h3 className="text-2xl font-bold text-[#0E073D] mb-2">{tier.tier}</h3>
              </div>
              <ul className="space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Login Page
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useContext(AuthContext);
  const { navigate } = useContext(RouterContext);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const { data, error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E073D] to-purple-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <Database className="h-12 w-12 text-[#FFCD00] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#0E073D]">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isSignUp ? 'Start your data modeling journey' : 'Sign in to your account'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-medium mb-2">Demo Accounts:</p>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Free:</strong> free@demo.com</p>
            <p><strong>Premium:</strong> premium@demo.com</p>
            <p><strong>Ultimate:</strong> ultimate@demo.com</p>
            <p className="text-xs mt-2">Password: any text</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFCD00] focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFCD00] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#FFCD00] text-[#0E073D] py-3 px-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#0E073D] font-semibold hover:text-[#FFCD00] transition-colors"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Page
const DashboardPage = () => {
  const { user, getUserTier } = useContext(AuthContext);
  const { navigate } = useContext(RouterContext);
  const userTier = getUserTier();

  const getTierFeatures = () => {
    switch (userTier) {
      case USER_TIERS.PREMIUM:
        return ['Conceptual Diagrams', 'Logical Models', 'Model Saving'];
      case USER_TIERS.ULTIMATE:
        return ['Conceptual Diagrams', 'Logical Models', 'ETL Generation', 'Advanced Analytics'];
      default:
        return ['Basic Diagram Viewing'];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0E073D] mb-2">Welcome back!</h1>
          <p className="text-gray-600">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Database className="h-8 w-8 text-[#FFCD00]" />
              <span className="text-green-500 text-sm font-medium">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-[#0E073D] mb-1">
              {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Plan
            </h3>
            <p className="text-gray-600 text-sm">Current subscription</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="h-8 w-8 text-[#FFCD00]" />
              <span className="text-blue-500 text-sm font-medium">+12</span>
            </div>
            <h3 className="text-2xl font-bold text-[#0E073D] mb-1">24</h3>
            <p className="text-gray-600 text-sm">Models Created</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Workflow className="h-8 w-8 text-[#FFCD00]" />
              <span className="text-purple-500 text-sm font-medium">Latest</span>
            </div>
            <h3 className="text-2xl font-bold text-[#0E073D] mb-1">AI-Powered</h3>
            <p className="text-gray-600 text-sm">Model Generation</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-bold text-[#0E073D] mb-6">Your Plan Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Available Features:</h3>
              <ul className="space-y-2">
                {getTierFeatures().map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Quick Actions:</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/modeler')}
                  className="w-full text-left p-3 bg-[#FFCD00] bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <Layers className="h-5 w-5 text-[#0E073D]" />
                  <span className="font-medium text-[#0E073D]">Open Data Modeler</span>
                </button>
                <button className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-3">
                  <Upload className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Upload Data Source</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PROJECT_LIMITS = {
  [USER_TIERS.FREE]: 0,
  [USER_TIERS.PREMIUM]: 3,
  [USER_TIERS.ULTIMATE]: 25
};


const DataModelerPage = () => {
  const { getUserTier } = useContext(AuthContext);
  const userTier = getUserTier();
  
  // State management
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [headerAttributes, setHeaderAttributes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [conceptualModels, setConceptualModels] = useState([]);
  const [selectedConceptualModel, setSelectedConceptualModel] = useState(null);
  const [logicalModel, setLogicalModel] = useState(null);
  const [physicalModel, setPhysicalModel] = useState(null);
  const [etlCode, setEtlCode] = useState(null);
  const [activeStep, setActiveStep] = useState('projects'); // projects, upload, concepts, models, etl

  const canCreateProject = PROJECT_LIMITS[userTier] > 0 && projects.length < PROJECT_LIMITS[userTier];
  const canUploadData = userTier === USER_TIERS.PREMIUM || userTier === USER_TIERS.ULTIMATE;
  const canGenerateModels = userTier === USER_TIERS.PREMIUM || userTier === USER_TIERS.ULTIMATE;

  // Project management
  const handleCreateProject = () => {
    if (!canCreateProject || !newProjectName.trim()) return;
    
    const newProject = {
      id: `project_${Date.now()}`,
      name: newProjectName.trim(),
      createdAt: new Date().toISOString(),
      conceptualModel: null,
      logicalModel: null,
      physicalModel: null,
      etlCode: null
    };
    
    setProjects([...projects, newProject]);
    setSelectedProject(newProject);
    setNewProjectName('');
    setShowCreateProject(false);
    setActiveStep('upload');
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    if (project.conceptualModel) {
      setSelectedConceptualModel(project.conceptualModel);
      setLogicalModel(project.logicalModel);
      setPhysicalModel(project.physicalModel);
      setEtlCode(project.etlCode);
      setActiveStep('models');
    } else {
      setActiveStep('upload');
    }
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
      setActiveStep('projects');
    }
  };

  // File upload handling
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Simulate reading CSV headers
      const mockHeaders = 'customer_id,email,first_name,last_name,order_date,product_name,quantity,price';
      setHeaderAttributes(mockHeaders);
    }
  };

  // Mock Claude API calls
  const generateConceptualModels = async () => {
    setIsGenerating(true);
    setActiveStep('concepts');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConceptualModels(MOCK_CONCEPTUAL_MODELS);
    setIsGenerating(false);
  };

  const selectConceptualModel = async (model) => {
    setSelectedConceptualModel(model);
    setIsGenerating(true);
    
    // Update project with selected conceptual model
    const updatedProject = {
      ...selectedProject,
      conceptualModel: model
    };
    
    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    
    // Generate logical and physical models
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const finalProject = {
      ...updatedProject,
      logicalModel: MOCK_LOGICAL_MODEL,
      physicalModel: MOCK_PHYSICAL_MODEL
    };
    
    setProjects(projects.map(p => p.id === selectedProject.id ? finalProject : p));
    setSelectedProject(finalProject);
    setLogicalModel(MOCK_LOGICAL_MODEL);
    setPhysicalModel(MOCK_PHYSICAL_MODEL);
    setActiveStep('models');
    setIsGenerating(false);
  };

  const generateETL = async () => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const updatedProject = {
      ...selectedProject,
      etlCode: MOCK_ETL_CODE
    };
    
    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    setEtlCode(MOCK_ETL_CODE);
    setActiveStep('etl');
    setIsGenerating(false);
  };

  const renderProjectsView = () => (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#0E073D]">Data Modeling Projects</h2>
          <p className="text-gray-600 mt-2">
            Create and manage your data modeling projects ({projects.length}/{PROJECT_LIMITS[userTier]} used)
          </p>
        </div>
        
        {canCreateProject && (
          <button
            onClick={() => setShowCreateProject(true)}
            className="bg-[#FFCD00] text-[#0E073D] px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Project</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFCD00]"
            />
            <button
              onClick={handleCreateProject}
              disabled={!newProjectName.trim()}
              className="bg-[#0E073D] text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-800 transition-colors disabled:bg-gray-300"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateProject(false)}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Projects Yet</h3>
          <p className="text-gray-500 mb-6">Create your first data modeling project to get started</p>
          {!canCreateProject && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-yellow-800 text-sm">
                {userTier === USER_TIERS.FREE 
                  ? 'Upgrade to Premium to create projects'
                  : 'You have reached your project limit'
                }
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  {project.conceptualModel ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-gray-300" />}
                  <span className="text-sm text-gray-600">Conceptual Model</span>
                </div>
                <div className="flex items-center space-x-2">
                  {project.logicalModel ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-gray-300" />}
                  <span className="text-sm text-gray-600">Logical Model</span>
                </div>
                <div className="flex items-center space-x-2">
                  {project.physicalModel ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-gray-300" />}
                  <span className="text-sm text-gray-600">Physical Model</span>
                </div>
                <div className="flex items-center space-x-2">
                  {project.etlCode ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-gray-300" />}
                  <span className="text-sm text-gray-600">ETL Pipeline</span>
                </div>
              </div>
              
              <button
                onClick={() => handleSelectProject(project)}
                className="w-full bg-[#0E073D] text-white py-2 rounded-lg font-medium hover:bg-purple-800 transition-colors flex items-center justify-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Open Project</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderUploadView = () => (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0E073D] mb-2">Upload Data Attributes</h2>
        <p className="text-gray-600">Upload your CSV file or paste header attributes to generate conceptual models</p>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Upload CSV File</h3>
          <p className="text-gray-500 mb-4">Drop your CSV file here or click to browse</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csvUpload"
          />
          <label
            htmlFor="csvUpload"
            className="bg-[#FFCD00] text-[#0E073D] px-6 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors cursor-pointer inline-block"
          >
            Choose File
          </label>
          {uploadedFile && (
            <p className="text-sm text-green-600 mt-2">
              ✓ {uploadedFile.name} uploaded successfully
            </p>
          )}
        </div>

        {/* Manual Attributes Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or paste header attributes manually:
          </label>
          <textarea
            value={headerAttributes}
            onChange={(e) => setHeaderAttributes(e.target.value)}
            placeholder="customer_id,email,first_name,last_name,order_date,product_name,quantity,price"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFCD00] h-32"
          />
        </div>

        {/* Generate Button */}
        <div className="flex space-x-4">
          <button
            onClick={generateConceptualModels}
            disabled={!headerAttributes.trim() || isGenerating}
            className="flex-1 bg-[#0E073D] text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition-colors disabled:bg-gray-300 flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <GitBranch className="h-4 w-4" />
            )}
            <span>
              {isGenerating ? 'Generating Models...' : 'Generate Conceptual Models'}
            </span>
          </button>
          
          <button
            onClick={() => setActiveStep('projects')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );

  const renderConceptsView = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0E073D] mb-2">Choose Conceptual Model</h2>
        <p className="text-gray-600">Select the conceptual model that best fits your data structure</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {conceptualModels.map((model) => (
          <div
            key={model.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => selectConceptualModel(model)}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{model.name}</h3>
              <span className={`text-xs px-2 py-1 rounded ${
                model.complexity === 'High' ? 'bg-red-100 text-red-600' :
                model.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                {model.complexity}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{model.description}</p>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Entities:</h4>
              <div className="flex flex-wrap gap-1">
                {model.entities.map((entity, idx) => (
                  <span key={idx} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    {entity}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="border border-gray-200 rounded p-4 bg-gray-50">
              <MermaidChart chart={model.mermaidCode} />
            </div>
            
            <button className="w-full mt-4 bg-[#FFCD00] text-[#0E073D] py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
              Select This Model
            </button>
          </div>
        ))}
      </div>

      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-[#0E073D]" />
            <h3 className="text-lg font-semibold mb-2">Generating Models</h3>
            <p className="text-gray-600">Creating logical and physical models...</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderModelsView = () => (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0E073D] mb-2">{selectedProject?.name}</h2>
        <p className="text-gray-600">Generated data models for your project</p>
      </div>

      <div className="space-y-8">
        {/* Conceptual Model */}
        {selectedConceptualModel && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Conceptual Model</h3>
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <MermaidChart chart={selectedConceptualModel.mermaidCode} />
            </div>
          </div>
        )}

        {/* Logical Model */}
        {logicalModel && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Logical Model</h3>
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <MermaidChart chart={logicalModel.mermaidCode} />
            </div>
          </div>
        )}

        {/* Physical Model */}
        {physicalModel && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Physical Model (SQL Schema)</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
              <pre className="text-sm">{physicalModel.sqlCode}</pre>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {physicalModel && !etlCode && (
            <button
              onClick={generateETL}
              disabled={isGenerating}
              className="bg-[#0E073D] text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-800 transition-colors disabled:bg-gray-300 flex items-center space-x-2"
            >
              {isGenerating ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Code className="h-4 w-4" />
              )}
              <span>Generate ETL Pipeline</span>
            </button>
          )}

          {etlCode && (
            <button
              onClick={() => setActiveStep('etl')}
              className="bg-[#FFCD00] text-[#0E073D] px-6 py-3 rounded-lg font-medium hover:bg-yellow-300 transition-colors flex items-center space-x-2"
            >
              <Code className="h-4 w-4" />
              <span>View ETL Code</span>
            </button>
          )}

          <button
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Models</span>
          </button>

          <button
            onClick={() => setActiveStep('projects')}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    </div>
  );

  const renderETLView = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0E073D] mb-2">ETL Pipeline</h2>
        <p className="text-gray-600">Generated Bonobo ETL code for your data model</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Bonobo ETL Pipeline</h3>
          <button className="bg-[#FFCD00] text-[#0E073D] px-4 py-2 rounded font-medium hover:bg-yellow-300 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
        
        <div className="bg-gray-900 text-green-400 p-6 rounded overflow-x-auto">
          <pre className="text-sm">{etlCode}</pre>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => setActiveStep('models')}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Models
          </button>
          
          <button
            onClick={() => setActiveStep('projects')}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-16">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => setActiveStep('projects')}
              className={`${activeStep === 'projects' ? 'text-[#0E073D] font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Projects
            </button>
            
            {selectedProject && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <button 
                  onClick={() => setActiveStep('upload')}
                  className={`${activeStep === 'upload' ? 'text-[#0E073D] font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {selectedProject.name}
                </button>
              </>
            )}
            
            {activeStep === 'concepts' && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-[#0E073D] font-medium">Choose Model</span>
              </>
            )}
            
            {(activeStep === 'models' || activeStep === 'etl') && selectedConceptualModel && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-[#0E073D] font-medium">
                  {activeStep === 'models' ? 'Models' : 'ETL Pipeline'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {activeStep === 'projects' && renderProjectsView()}
          {activeStep === 'upload' && renderUploadView()}
          {activeStep === 'concepts' && renderConceptsView()}
          {activeStep === 'models' && renderModelsView()}
          {activeStep === 'etl' && renderETLView()}
        </div>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const { navigate } = useContext(RouterContext);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-[#FFCD00]" />
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

// Router Component
const AppRouter = () => {
  const { currentRoute } = useContext(RouterContext);
  
  switch (currentRoute) {
    case '/':
      return <HomePage />;
    case '/features':
      return <FeaturesPage />;
    case '/login':
      return <LoginPage />;
    case '/dashboard':
      return (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      );
    case '/modeler':
      return (
        <ProtectedRoute>
          <DataModelerPage />
        </ProtectedRoute>
      );
    default:
      return <HomePage />;
  }
};

// Main App Component
const DataMindApp = () => {
  return (
    <AuthProvider>
      <RouterProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <AppRouter />
        </div>
      </RouterProvider>
    </AuthProvider>
  );
};

export default DataMindApp;