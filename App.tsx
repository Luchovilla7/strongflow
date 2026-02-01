
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, Dumbbell, Apple, Settings, Zap, TrendingUp,
  Award, Heart, Sparkles, Flower2, Star, Ruler, Gem, Trophy,
  ChevronRight, LogOut, Mail, Lock, Plus, Save
} from 'lucide-react';

// --- CONFIGURACIÓN SUPABASE ---
const SUPABASE_URL = 'https://qybecjvaklnkrsoagyuw.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5YmVjanZha2xua3Jzb2FneXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MzgxMTIsImV4cCI6MjA4NTUxNDExMn0.l-wtd33RTVWZ_jFrzNUM-bdTNURHetGtngJo_y8bTa4';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Tipos ---
interface Profile {
  id: string;
  username: string;
  current_weight: number;
  target_weight: number;
}

interface TrainingLog {
  id: string;
  exercise_name: string;
  weight: number;
  reps: number;
  feeling: string;
  created_at: string;
}

interface Measurement {
  id: string;
  gluteos: number;
  muslos: number;
  created_at: string;
}

// --- Componente de Login ---
const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-pink-50 to-rose-100">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-pink-100 w-full max-w-md animate-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-200 mb-4">
            <Gem className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">StrongFlow</h1>
          <p className="text-pink-400 font-bold text-sm uppercase tracking-widest mt-2">Empoderamiento Fitness</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-pink-300" size={18} />
            <input 
              type="email" placeholder="Tu Email" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 font-bold"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-pink-300" size={18} />
            <input 
              type="password" placeholder="Contraseña" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 font-bold"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-pink-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-pink-100 hover:bg-pink-600 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Procesando...' : (isSignUp ? 'Crear Cuenta ✨' : 'Entrar al Flow 🌸')}
          </button>
        </form>
        
        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-6 text-pink-400 font-bold text-xs uppercase tracking-widest text-center"
        >
          {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿Nueva aquí? Regístrate'}
        </button>
      </div>
    </div>
  );
};

// --- Dashboard Component ---
const Dashboard: React.FC<{ profile: Profile | null, logs: TrainingLog[], measurements: Measurement[] }> = ({ profile, logs, measurements }) => {
  const chartData = [...logs].reverse().map(l => ({
    date: new Date(l.created_at).toLocaleDateString('es-ES', { weekday: 'short' }),
    weight: l.weight
  })).slice(-7);

  const lastSquat = logs.find(l => l.exercise_name.toLowerCase().includes('sentadilla'))?.weight || 0;
  const lastGlute = measurements[0]?.gluteos || 0;

  return (
    <div className="space-y-6 animate-in pb-24">
      <div className="bg-gradient-to-r from-pink-100/50 to-rose-100/50 p-6 rounded-[2.5rem] border border-pink-200 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-pink-600 flex items-center gap-2">
            ¡Hola, {profile?.username || 'Imparable'}! <Sparkles className="w-6 h-6 animate-pulse" />
          </h2>
          <p className="text-pink-500/80 text-sm italic font-medium">"Tu única competencia eres tu versión de ayer"</p>
        </div>
        <Flower2 className="text-pink-400 w-10 h-10 opacity-50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50">
          <span className="text-pink-400 text-[10px] font-black uppercase tracking-widest mb-2 block">Peso Actual</span>
          <div className="text-3xl font-black text-slate-700">{profile?.current_weight || 0} kg</div>
          <div className="mt-2 h-1.5 w-full bg-pink-50 rounded-full overflow-hidden">
             <div className="h-full bg-pink-400 transition-all duration-700" style={{width: `${Math.min(((profile?.current_weight || 0)/(profile?.target_weight || 1))*100, 100)}%`}}></div>
          </div>
          <div className="text-[9px] text-pink-400 mt-2 font-bold uppercase tracking-wider">Objetivo: {profile?.target_weight || 0}kg</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50">
          <span className="text-pink-400 text-[10px] font-black uppercase tracking-widest mb-2 block">Última Sentadilla</span>
          <div className="text-3xl font-black text-slate-700">{lastSquat} kg</div>
          <div className="text-[10px] bg-purple-50 text-purple-500 px-2 py-0.5 rounded-full inline-block mt-2">🦄 Top Esfuerzo</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50">
          <span className="text-pink-400 text-[10px] font-black uppercase tracking-widest mb-2 block">Glúteos</span>
          <div className="text-3xl font-black text-slate-700">{lastGlute} cm</div>
          <div className="text-[10px] bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full inline-block mt-2">🍑 Evolución</div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-pink-50">
        <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
          <TrendingUp className="w-4 h-4 text-pink-500" /> Historial de Cargas
        </h3>
        <div className="h-48 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fff1f2" />
                <XAxis dataKey="date" hide />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#f472b6" strokeWidth={4} dot={{ fill: '#f472b6' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 text-xs font-bold uppercase italic">
              Sin datos registrados aún... ¡A darle! 🔥
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Training View ---
const TrainingView: React.FC<{ onSave: (log: Omit<TrainingLog, 'id' | 'created_at'>) => void }> = ({ onSave }) => {
  const [exercise, setExercise] = useState('Sentadilla');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [feeling, setFeeling] = useState('Buena');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !reps) return;
    onSave({ exercise_name: exercise, weight: parseFloat(weight), reps: parseInt(reps), feeling });
    setWeight('');
    setReps('');
    alert("¡Entrenamiento guardado con éxito! ✨");
  };

  return (
    <div className="animate-in pb-24">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-pink-50">
        <h2 className="text-2xl font-black text-pink-600 italic text-center mb-8">Nueva Sesión ✨</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-2">Ejercicio</label>
            <select 
              value={exercise} onChange={e => setExercise(e.target.value)}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700"
            >
              <option>Sentadilla</option>
              <option>Hip Thrust</option>
              <option>Peso Muerto</option>
              <option>Zancadas</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-2">Peso (kg)</label>
              <input 
                type="number" step="0.5" value={weight} onChange={e => setWeight(e.target.value)}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" placeholder="30"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-2">Reps</label>
              <input 
                type="number" value={reps} onChange={e => setReps(e.target.value)}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" placeholder="10"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-black py-5 rounded-[2rem] shadow-lg shadow-pink-100 flex items-center justify-center gap-2">
            <Save size={20} /> Guardar Entrenamiento
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Measurements View ---
const MeasurementsView: React.FC<{ onSave: (m: { gluteos: number, muslos: number }) => void }> = ({ onSave }) => {
  const [gluteos, setGluteos] = useState('');
  const [muslos, setMuslos] = useState('');

  const handleSave = () => {
    if (!gluteos || !muslos) return;
    onSave({ gluteos: parseFloat(gluteos), muslos: parseFloat(muslos) });
    setGluteos('');
    setMuslos('');
    alert("¡Medidas actualizadas! 🍑✨");
  };

  return (
    <div className="animate-in pb-24">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-pink-50 text-center">
        <h2 className="text-2xl font-black text-rose-500 italic mb-8">Track Curvas ✨</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-rose-50/50 rounded-3xl border border-rose-100">
            <span className="block text-[10px] font-black text-rose-400 uppercase mb-2">Glúteos (cm)</span>
            <input 
              type="number" step="0.1" value={gluteos} onChange={e => setGluteos(e.target.value)}
              className="bg-transparent text-center text-2xl font-black text-rose-600 focus:outline-none w-full" placeholder="99" 
            />
          </div>
          <div className="p-6 bg-orange-50/50 rounded-3xl border border-orange-100">
            <span className="block text-[10px] font-black text-orange-400 uppercase mb-2">Muslo (cm)</span>
            <input 
              type="number" step="0.1" value={muslos} onChange={e => setMuslos(e.target.value)}
              className="bg-transparent text-center text-2xl font-black text-orange-600 focus:outline-none w-full" placeholder="56"
            />
          </div>
        </div>
        <button onClick={handleSave} className="px-10 py-4 bg-rose-400 text-white font-black rounded-full shadow-xl shadow-rose-100 text-xs uppercase tracking-widest">
          Registrar Evolución
        </button>
      </div>
    </div>
  );
};

// --- App Principal ---
const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'training' | 'measurements' | 'nutrition'>('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) refreshAllData(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) refreshAllData(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshAllData = async (userId: string) => {
    fetchProfile(userId);
    fetchLogs(userId);
    fetchMeasurements(userId);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
    else {
      const { data: newP } = await supabase.from('profiles').insert([{ id: userId, username: 'Guerriera', current_weight: 60, target_weight: 65 }]).select().single();
      setProfile(newP);
    }
  };

  const fetchLogs = async (userId: string) => {
    const { data } = await supabase.from('training_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) setLogs(data);
  };

  const fetchMeasurements = async (userId: string) => {
    const { data } = await supabase.from('measurements').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) setMeasurements(data);
  };

  const saveLog = async (logData: Omit<TrainingLog, 'id' | 'created_at'>) => {
    if (!session) return;
    const { error } = await supabase.from('training_logs').insert([{ ...logData, user_id: session.user.id }]);
    if (!error) fetchLogs(session.user.id);
  };

  const saveMeasurement = async (mData: { gluteos: number, muslos: number }) => {
    if (!session) return;
    const { error } = await supabase.from('measurements').insert([{ ...mData, user_id: session.user.id }]);
    if (!error) fetchMeasurements(session.user.id);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (!session) return <LoginView />;

  return (
    <div className="min-h-screen bg-[#fffdfd] pb-24 px-4 md:px-8 max-w-lg mx-auto pt-8 select-none">
      <header className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-200">
            <Gem className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tighter">StrongFlow</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSignOut} className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-400 shadow-sm">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'dashboard' && <Dashboard profile={profile} logs={logs} measurements={measurements} />}
        {activeTab === 'training' && <TrainingView onSave={saveLog} />}
        {activeTab === 'measurements' && <MeasurementsView onSave={saveMeasurement} />}
        {activeTab === 'nutrition' && (
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-pink-50 text-center animate-in">
             <Apple className="w-12 h-12 text-pink-400 mx-auto mb-4" />
             <h2 className="text-xl font-black text-pink-600">Nutrición Pro</h2>
             <p className="text-slate-400 text-sm mt-2">Módulo en desarrollo. ¡Mantente hidratada! 💧</p>
          </div>
        )}
      </main>

      <nav className="fixed bottom-6 left-4 right-4 max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-pink-100 rounded-[2.5rem] shadow-2xl flex justify-around p-3 z-50">
        {[
          { id: 'dashboard', Icon: LayoutDashboard, label: 'Inicio' },
          { id: 'training', Icon: Dumbbell, label: 'Entrenar' },
          { id: 'measurements', Icon: Ruler, label: 'Curvas' },
          { id: 'nutrition', Icon: Apple, label: 'Nutri' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 px-4 py-2 rounded-3xl ${
              activeTab === tab.id ? 'bg-pink-50 text-pink-600 scale-110' : 'text-slate-400'
            }`}
          >
            <tab.Icon size={22} strokeWidth={activeTab === tab.id ? 3 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
