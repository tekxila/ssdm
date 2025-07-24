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
  RefreshCw
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

// Mock Data
const MOCK_CONCEPTUAL_DIAGRAMS = [
  {
    id: 'concept_1',
    name: 'E-commerce Platform',
    description: 'Core entities for an e-commerce system',
    complexity: 'Medium',
    entities: ['Customer', 'Product', 'Order', 'Payment'],
    mermaidCode: `erDiagram
    CUSTOMER {
        int customer_id PK
        string first_name
        string last_name
        string email
        date created_at
    }
    PRODUCT {
        int product_id PK
        string name
        decimal price
        int stock_quantity
        string category
    }
    ORDER {
        int order_id PK
        int customer_id FK
        date order_date
        decimal total_amount
        string status
    }
    PAYMENT {
        int payment_id PK
        int order_id FK
        string payment_method
        decimal amount
        date payment_date
    }
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|| PAYMENT : has
    ORDER }o--o{ PRODUCT : contains`
  },
  {
    id: 'concept_2',
    name: 'Healthcare System',
    description: 'Patient management and medical records',
    complexity: 'High',
    entities: ['Patient', 'Doctor', 'Appointment', 'MedicalRecord'],
    mermaidCode: `erDiagram
    PATIENT {
        int patient_id PK
        string first_name
        string last_name
        date birth_date
        string phone
        string address
    }
    DOCTOR {
        int doctor_id PK
        string first_name
        string last_name
        string specialization
        string license_number
    }
    APPOINTMENT {
        int appointment_id PK
        int patient_id FK
        int doctor_id FK
        datetime appointment_time
        string status
        string notes
    }
    MEDICAL_RECORD {
        int record_id PK
        int patient_id FK
        date visit_date
        string diagnosis
        string treatment
        string prescription
    }
    PATIENT ||--o{ APPOINTMENT : schedules
    DOCTOR ||--o{ APPOINTMENT : conducts
    PATIENT ||--o{ MEDICAL_RECORD : has`
  },
  {
    id: 'concept_3',
    name: 'Financial System',
    description: 'Banking and transaction management',
    complexity: 'High',
    entities: ['Account', 'Transaction', 'Customer', 'Branch'],
    mermaidCode: `erDiagram
    CUSTOMER {
        int customer_id PK
        string ssn
        string first_name
        string last_name
        string email
        string phone
    }
    ACCOUNT {
        int account_id PK
        int customer_id FK
        string account_number
        string account_type
        decimal balance
        date created_date
    }
    TRANSACTION {
        int transaction_id PK
        int account_id FK
        string transaction_type
        decimal amount
        date transaction_date
        string description
    }
    BRANCH {
        int branch_id PK
        string branch_name
        string address
        string phone
        string manager_name
    }
    CUSTOMER ||--o{ ACCOUNT : owns
    ACCOUNT ||--o{ TRANSACTION : has
    BRANCH ||--o{ ACCOUNT : manages`
  }
];

const MOCK_LOGICAL_DIAGRAMS = {
  concept_1: {
    name: 'E-commerce Platform - Logical Model',
    tables: [
      {
        name: 'customers',
        columns: [
          { name: 'customer_id', type: 'SERIAL', constraints: ['PRIMARY KEY'] },
          { name: 'first_name', type: 'VARCHAR(50)', constraints: ['NOT NULL'] },
          { name: 'last_name', type: 'VARCHAR(50)', constraints: ['NOT NULL'] },
          { name: 'email', type: 'VARCHAR(255)', constraints: ['UNIQUE', 'NOT NULL'] },
          { name: 'created_at', type: 'TIMESTAMP', constraints: ['DEFAULT CURRENT_TIMESTAMP'] }
        ]
      },
      {
        name: 'products',
        columns: [
          { name: 'product_id', type: 'SERIAL', constraints: ['PRIMARY KEY'] },
          { name: 'name', type: 'VARCHAR(255)', constraints: ['NOT NULL'] },
          { name: 'price', type: 'DECIMAL(10,2)', constraints: ['NOT NULL'] },
          { name: 'stock_quantity', type: 'INTEGER', constraints: ['DEFAULT 0'] },
          { name: 'category', type: 'VARCHAR(100)', constraints: [] }
        ]
      }
    ],
    mermaidCode: `erDiagram
    customers {
        SERIAL customer_id PK
        VARCHAR_50 first_name "NOT NULL"
        VARCHAR_50 last_name "NOT NULL"
        VARCHAR_255 email "UNIQUE, NOT NULL"
        TIMESTAMP created_at "DEFAULT CURRENT_TIMESTAMP"
    }
    products {
        SERIAL product_id PK
        VARCHAR_255 name "NOT NULL"
        DECIMAL_10_2 price "NOT NULL"
        INTEGER stock_quantity "DEFAULT 0"
        VARCHAR_100 category
    }
    orders {
        SERIAL order_id PK
        INTEGER customer_id FK
        TIMESTAMP order_date "DEFAULT CURRENT_TIMESTAMP"
        DECIMAL_10_2 total_amount "NOT NULL"
        VARCHAR_20 status "DEFAULT 'pending'"
    }
    customers ||--o{ orders : places`
  }
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

// Data Modeler Page - Main Application
const DataModelerPage = () => {
  const { getUserTier } = useContext(AuthContext);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [showLogical, setShowLogical] = useState(false);
  const [savedModels, setSavedModels] = useState([]);
  const [selectedETLAttribute, setSelectedETLAttribute] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const userTier = getUserTier();
  const canSelectConcept = userTier === USER_TIERS.PREMIUM || userTier === USER_TIERS.ULTIMATE;
  const canViewLogical = userTier === USER_TIERS.PREMIUM || userTier === USER_TIERS.ULTIMATE;
  const canSaveModel = userTier === USER_TIERS.PREMIUM || userTier === USER_TIERS.ULTIMATE;
  const canViewETL = userTier === USER_TIERS.ULTIMATE;

  const handleConceptSelect = (concept) => {
    if (!canSelectConcept) return;
    setSelectedConcept(concept);
    setShowLogical(false);
    setSelectedETLAttribute(null);
  };

  const handleSaveModel = async () => {
    if (!canSaveModel || !selectedConcept) return;
    
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newModel = {
      id: `saved_${Date.now()}`,
      name: selectedConcept.name,
      conceptId: selectedConcept.id,
      savedAt: new Date().toISOString(),
      hasLogical: showLogical
    };
    
    setSavedModels([...savedModels, newModel]);
    setIsGenerating(false);
  };

  const generateLogicalDiagram = async () => {
    if (!canViewLogical) return;
    
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowLogical(true);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen pt-16">
        {/* Left Sidebar - Interactive Elements */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0E073D] mb-6">Data Modeler</h2>
            
            {/* Conceptual Diagrams */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Conceptual Models</h3>
                {userTier === USER_TIERS.FREE && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    View Only
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                {MOCK_CONCEPTUAL_DIAGRAMS.map((concept) => (
                  <div
                    key={concept.id}
                    onClick={() => handleConceptSelect(concept)}
                    className={`p-4 border rounded-lg transition-all cursor-pointer ${
                      selectedConcept?.id === concept.id
                        ? 'border-[#FFCD00] bg-[#FFCD00] bg-opacity-20'
                        : canSelectConcept
                        ? 'border-gray-200 hover:border-[#FFCD00] hover:bg-gray-50'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-800 text-sm">{concept.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        concept.complexity === 'High' ? 'bg-red-100 text-red-600' :
                        concept.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {concept.complexity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{concept.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {concept.entities.slice(0, 3).map((entity, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          {entity}
                        </span>
                      ))}
                      {concept.entities.length > 3 && (
                        <span className="text-xs text-gray-500">+{concept.entities.length - 3}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logical Diagram Controls */}
            {selectedConcept && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">Logical Model</h3>
                <button
                  onClick={generateLogicalDiagram}
                  disabled={!canViewLogical || isGenerating}
                  className={`w-full p-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    canViewLogical
                      ? 'bg-[#0E073D] text-white hover:bg-purple-800'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <GitBranch className="h-4 w-4" />
                  )}
                  <span>
                    {isGenerating ? 'Generating...' : 'Generate Logical Model'}
                  </span>
                </button>
                
                {!canViewLogical && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Upgrade to Premium to access logical diagrams
                  </p>
                )}
              </div>
            )}

            {/* ETL Controls */}
            {selectedConcept && canViewETL && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">ETL Pipeline</h3>
                <div className="space-y-2">
                  {['customer_id', 'email', 'order_date'].map((attr) => (
                    <button
                      key={attr}
                      onClick={() => setSelectedETLAttribute(attr)}
                      className={`w-full text-left p-2 rounded transition-colors ${
                        selectedETLAttribute === attr
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <span className="text-sm font-medium">{attr}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Models */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Saved Models</h3>
              {savedModels.length === 0 ? (
                <p className="text-sm text-gray-500">No saved models yet</p>
              ) : (
                <div className="space-y-2">
                  {savedModels.map((model) => (
                    <div key={model.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 text-sm">{model.name}</h4>
                      <p className="text-xs text-gray-500">
                        Saved {new Date(model.savedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Panel - Diagram Viewing */}
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="p-6">
            {!selectedConcept ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">
                    Select a Conceptual Model
                  </h3>
                  <p className="text-gray-500">
                    Choose a model from the left panel to view and work with it
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Conceptual Diagram */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#0E073D]">
                      {selectedConcept.name} - Conceptual Model
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {selectedConcept.entities.length} entities
                      </span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                    <pre className="text-sm font-mono bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
                      {selectedConcept.mermaidCode}
                    </pre>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                    <pre className="text-sm font-mono bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
                      <MermaidChart chart = {selectedConcept.mermaidCode}/>
                    </pre>
                  </div>
                </div>

                {/* Logical Diagram */}
                {showLogical && MOCK_LOGICAL_DIAGRAMS[selectedConcept.id] && (
                  <div>
                    <h3 className="text-lg font-bold text-[#0E073D] mb-4">
                      Logical Model - Database Schema
                    </h3>
                    
                    <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                      <pre className="text-sm font-mono bg-gray-800 text-blue-400 p-4 rounded overflow-x-auto">
                        {MOCK_LOGICAL_DIAGRAMS[selectedConcept.id].mermaidCode}
                      </pre>
                    </div>
                  </div>
                )}

                {/* ETL Code */}
                {selectedETLAttribute && canViewETL && MOCK_ETL_PROCESSES[selectedConcept.id]?.[selectedETLAttribute] && (
                  <div>
                    <h3 className="text-lg font-bold text-[#0E073D] mb-4">
                      ETL Pipeline - {selectedETLAttribute}
                    </h3>
                    
                    <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 mb-2">Process Overview:</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Extract:</span>
                            <p className="text-gray-700">{MOCK_ETL_PROCESSES[selectedConcept.id][selectedETLAttribute].extractSource}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Transform:</span>
                            <div className="text-gray-700">
                              {MOCK_ETL_PROCESSES[selectedConcept.id][selectedETLAttribute].transformRules.map((rule, idx) => (
                                <p key={idx}>• {rule}</p>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Load:</span>
                            <p className="text-gray-700">{MOCK_ETL_PROCESSES[selectedConcept.id][selectedETLAttribute].loadTarget}</p>
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-gray-800 mb-2">Bonobo ETL Code:</h4>
                      <pre className="text-sm font-mono bg-gray-800 text-purple-400 p-4 rounded overflow-x-auto">
                        {MOCK_ETL_PROCESSES[selectedConcept.id][selectedETLAttribute].bonoboCode}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - User Actions */}
        <div className="w-64 bg-gray-50 border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Actions</h3>
            
            {selectedConcept && (
              <div className="space-y-4">
                <button
                  onClick={handleSaveModel}
                  disabled={!canSaveModel || isGenerating}
                  className={`w-full p-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    canSaveModel
                      ? 'bg-[#FFCD00] text-[#0E073D] hover:bg-yellow-300'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save Model</span>
                </button>

                <button
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Diagram</span>
                </button>

                <button
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Code className="h-4 w-4" />
                  <span>Generate SQL</span>
                </button>

                {!canSaveModel && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Upgrade for More</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      Get Premium to save models and access logical diagrams
                    </p>
                    <button className="w-full p-2 bg-yellow-200 text-yellow-800 rounded font-medium hover:bg-yellow-300 transition-colors">
                      Upgrade Now
                    </button>
                  </div>
                )}
              </div>
            )}

            {!selectedConcept && (
              <div className="text-center text-gray-500">
                <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Select a model to see available actions</p>
              </div>
            )}
          </div>
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