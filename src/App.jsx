import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  BarChart2, 
  User, 
  History, 
  Settings, 
  ChevronLeft, 
  Play, 
  Save, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  TrendingUp, 
  Activity, 
  X, 
  Zap, 
  Keyboard, 
  Trophy, 
  AlertTriangle,
  ChevronDown,
  Minus,
  Hash,
  Shield,
  CalendarDays,
  Dumbbell,
  Timer,
  Info,
  Check
} from 'lucide-react';

// --- Constants & Databases ---

const FOOTBALL_ROUTINES = [
    // --- IN-SEASON ---
    { 
      id: 'in_1',
      phase: 'In-Season',
      name: "Day 1: Max Strength", 
      focus: "Push/Squat (Maintenance)", 
      description: "Maintains force production capabilities during the season without inducing excessive fatigue. Critical for holding off defenders.",
      exercises: [
        { 
            name: 'Barbell/DB Bench Press', 
            sets: 3, 
            reps: 8, 
            instructions: "Lie flat on the bench. Lower the weight to mid-chest with control, then drive up explosively. Keep feet planted.",
            alternative: "Machine Chest Press",
            bodyweight: "Decline Push-Ups"
        }, 
        { 
            name: 'Front Squat', 
            sets: 3, 
            reps: 8, 
            instructions: "Rest the bar on your front delts with elbows high. Squat deep while keeping your chest upright to target quads and core.",
            alternative: "Goblet Squats (Kettlebell)",
            bodyweight: "Pistol Squats (or assisted Single-Leg Squat)"
        }, 
        { 
            name: 'Dumbbell Row', 
            sets: 3, 
            reps: 8, 
            instructions: "One hand on a bench, back flat. Pull the dumbbell to your hip, squeezing your lat at the top. Critical for shielding strength.",
            alternative: "Seated Cable Row",
            bodyweight: "Inverted Rows (using a table edge or low bar)"
        }, 
        { 
            name: 'Split Squat', 
            sets: 3, 
            reps: 8, 
            instructions: "Stagger stance. Drop the back knee towards the floor until the front thigh is parallel. Drive up through the front heel.",
            alternative: "Reverse Lunges (Barbell)",
            bodyweight: "Bodyweight Split Squats"
        }, 
        { 
            name: 'Plank', 
            sets: 3, 
            reps: 45, 
            instructions: "Forearms on ground, body in a straight line. Squeeze glutes and brace core as if taking a punch. Don't let hips sag.",
            alternative: "Pallof Press (Cable)",
            bodyweight: "Plank with Shoulder Taps"
        }
      ] 
    },
    { 
      id: 'in_2',
      phase: 'In-Season',
      name: "Day 2: Rotational Power", 
      focus: "Functional Push", 
      description: "Translates gym strength into pitch movements. Enhances shooting power and ability to turn opponents.",
      exercises: [
        { 
            name: 'Landmine Press', 
            sets: 3, 
            reps: 8, 
            instructions: "Wedge barbell in a corner. Stand leaning slightly forward. Press the bar up and forward with one arm using legs and shoulder.",
            alternative: "Single-Arm Dumbbell Shoulder Press",
            bodyweight: "Pike Push-Ups"
        }, 
        { 
            name: 'Cable Woodchopper', 
            sets: 3, 
            reps: 10, 
            instructions: "Set cable high. Rotate your torso to pull the handle down and across your body to the opposite hip. Control the return.",
            alternative: "Russian Twists (Weighted)",
            bodyweight: "Lying Windshield Wipers"
        }, 
        { 
            name: 'Med Ball Side Toss', 
            sets: 3, 
            reps: 6, 
            instructions: "Stand sideways to a wall. Rotate your hips aggressively to throw the ball hard against the wall. Catch and repeat.",
            alternative: "Resistance Band Rotations",
            bodyweight: "Rotational Jump Squats (180 turns)"
        }, 
        { 
            name: 'Pull-Ups', 
            sets: 3, 
            reps: 0, 
            instructions: "Grip bar just wider than shoulders. Pull chin over the bar, engaging lats. Lower fully to a dead hang.",
            alternative: "Lat Pulldown Machine",
            bodyweight: "Doorframe Rows"
        }
      ] 
    },
    { 
      id: 'in_3',
      phase: 'In-Season',
      name: "Day 3: Speed & Explosive", 
      focus: "Plyometrics", 
      description: "Primes the nervous system for match day. Keeps fast-twitch fibres firing for sprints and jumps.",
      exercises: [
        { 
            name: 'Explosive Push-Ups', 
            sets: 3, 
            reps: 10, 
            instructions: "Perform a standard push-up but drive up with enough force that your hands leave the ground momentarily.",
            alternative: "Bench Press Throws (Smith Machine)",
            bodyweight: "Clapping Push-Ups",
            hideWeight: true
        }, 
        { 
            name: 'Box Jumps', 
            sets: 3, 
            reps: 5, 
            instructions: "Stand in front of a box. Swing arms and jump, landing softly with knees bent. Step down (do not jump down).",
            alternative: "Weighted Squat Jumps",
            bodyweight: "Tuck Jumps",
            hideWeight: true
        }, 
        { 
            name: 'Nordic Hamstring Curl', 
            sets: 3, 
            reps: 5, 
            instructions: "Kneel with ankles held (or under a bar). Lower your torso slowly using only your hamstrings. Push yourself back up.",
            alternative: "Lying Leg Curl Machine",
            bodyweight: "Single-Leg Glute Bridges",
            hideWeight: true
        }, 
        { 
            name: 'Copenhagen Plank', 
            sets: 3, 
            reps: 20, 
            instructions: "Side plank position. Place top leg on a bench. Lift bottom leg to meet it and hold. Targets groin strength.",
            alternative: "Cable Hip Adduction",
            bodyweight: "Side Plank with Leg Lift",
            hideWeight: true
        }
      ] 
    },
    {
      id: 'in_4',
      phase: 'In-Season',
      name: "Non-Match Week: Match Sharpness",
      focus: "Agility (7mlc)",
      description: "Simulates match demands: acceleration, deceleration, and sharp turns. Perform only on weeks without a game.",
      exercises: [
        { name: 'Drill: Stop & Return', sets: 4, reps: 1, instructions: "Sprint ball to corner, stop it dead. Turn, sprint back to start without ball. Turn, sprint to ball, dribble to next corner.", alternative: "Shuttle Runs (with ball)", bodyweight: "Shuttle Runs (no ball)", hideWeight: true },
        { name: 'Drill: Inside-Out', sets: 4, reps: 1, instructions: "Dribble centre to corner, turn around cone, back to centre. Stop ball. Sprint without ball around the same cone and back.", alternative: "Figure 8 Dribbling", bodyweight: "Cone Weave Sprints", hideWeight: true },
        { name: 'Drill: Short & Sharp', sets: 4, reps: 1, instructions: "Dribble corner to centre, stop ball. Sprint around 2nd and 3rd cones. Sprint back to centre, collect ball, finish lap.", alternative: "T-Drill", bodyweight: "T-Drill Sprints", hideWeight: true },
        { name: 'Drill: Diagonal Sprint', sets: 4, reps: 1, instructions: "Dribble corner to corner. Stop ball. Sprint diagonally across square to opposite corner and back. Collect ball.", alternative: "Box Drill", bodyweight: "X-Drill Sprints", hideWeight: true },
        { name: 'Drill: Lap Runner', sets: 4, reps: 1, instructions: "Dribble to next corner, stop ball. Leave it, run a full lap of the square without ball. Return to ball, repeat.", alternative: "Perimeter Runs", bodyweight: "1km Interval Run", hideWeight: true }
      ]
    },

    // --- OFF-SEASON ---
    {
      id: 'off_1',
      phase: 'Off-Season',
      name: "Phase 1: Hypertrophy",
      focus: "Muscle Growth & Armour",
      description: "Higher volume training to build muscle mass and structural integrity. This is your 'armour' against collisions.",
      exercises: [
        { 
            name: 'Back Squat', 
            sets: 4, 
            reps: 10, 
            instructions: "Bar on upper back. Feet shoulder-width. Squat deep, keeping chest up and knees tracking over toes.",
            alternative: "Leg Press",
            bodyweight: "Step-Ups (High Reps)"
        },
        { 
            name: 'Romanian Deadlift', 
            sets: 4, 
            reps: 10, 
            instructions: "Bar in hands. Hinge at hips, pushing bum back with slight knee bend. Lower bar to shins, feel hamstring stretch.",
            alternative: "45-Degree Back Extension",
            bodyweight: "Single-Leg Deadlift (Arabesque)"
        },
        { 
            name: 'Military Press', 
            sets: 3, 
            reps: 10, 
            instructions: "Stand tall. Press barbell from collarbone to overhead lockout. Do not arch your back.",
            alternative: "Seated Dumbbell Shoulder Press",
            bodyweight: "Pike Push-Ups (Feet Elevated)"
        },
        { 
            name: 'Pull-Ups', 
            sets: 3, 
            reps: 0, 
            instructions: "Pull chin over bar. If you can do more than 12, add weight.",
            alternative: "Inverted Row",
            bodyweight: "Towel Door Rows"
        },
        { 
            name: 'Walking Lunges', 
            sets: 3, 
            reps: 12, 
            instructions: "Take long steps forward, dropping back knee to ground. Keep torso upright. 12 steps per leg.",
            alternative: "Bulgarian Split Squat",
            bodyweight: "Walking Lunges (High Reps)"
        }
      ] 
    },
    {
      id: 'off_2',
      phase: 'Off-Season',
      name: "Phase 1: Aerobic Base",
      focus: "Zone 2 Cardio",
      description: "Steady state cardio to build the engine size. Improves your ability to recover between high intensity bursts.",
      exercises: [
        { name: '5km Run (Steady State)', sets: 1, reps: 1, instructions: "Run at a pace where you could hold a conversation. Do not sprint. This builds aerobic capacity.", alternative: "Cycling / Rowing (30 mins)", bodyweight: "Burpees (Paced, 20 mins)", hideWeight: true },
        { name: 'Core: Dead Bugs', sets: 3, reps: 12, instructions: "Lie on back, arms and legs in air. Lower opposite arm and leg slowly to floor, keeping lower back pressed down.", alternative: "Hollow Body Hold", bodyweight: "Dead Bugs", hideWeight: true },
        { name: 'Core: Russian Twists', sets: 3, reps: 20, instructions: "Sit in V-shape, feet off floor. Rotate torso touching hands to floor on each side.", alternative: "Cable Woodchopper (Low to High)", bodyweight: "Bicycle Crunches" }
      ]
    },

    // --- PRE-SEASON ---
    {
      id: 'pre_1',
      phase: 'Pre-Season',
      name: "Phase 2: Power Conversion",
      focus: "Explosive Strength",
      description: "Converting the muscle built in off-season into usable football power. Moving moderate weights fast.",
      exercises: [
        { 
            name: 'Weighted Jump Squats', 
            sets: 4, 
            reps: 5, 
            instructions: "Holding dumbbells, squat down and explode up into a jump. Land softly and immediately repeat.",
            alternative: "Clean Pulls",
            bodyweight: "Squat Jumps (Max Height)"
        },
        { 
            name: 'Hang Clean (or DB Snatch)', 
            sets: 4, 
            reps: 5, 
            instructions: "Explosive hip drive to pull weight from knees to shoulders. Focus on speed of the bar.",
            alternative: "Kettlebell Swings",
            bodyweight: "Broad Jumps"
        },
        { 
            name: 'Bulgarian Split Squat', 
            sets: 3, 
            reps: 6, 
            instructions: "Back foot on bench. Lower deeply. Drive up explosively. Heavy weight, low reps.",
            alternative: "Step Ups (Explosive)",
            bodyweight: "Jumping Lunges"
        },
        { 
            name: 'Sled Push/Hill Sprints', 
            sets: 6, 
            reps: 1, 
            instructions: "Push a heavy sled or sprint up a steep hill for 20m. Max effort. Rest 2 mins between sets.",
            alternative: "Plate Pushes (on carpet)",
            bodyweight: "Hill Sprints or Stair Sprints",
            hideWeight: true
        }
      ] 
    },
    {
      id: 'pre_2',
      phase: 'Pre-Season',
      name: "Phase 2: Match Fitness",
      focus: "Intervals (15-15s)",
      description: "High intensity intervals to mimic game demands. Prepares the lungs for 90 minutes.",
      exercises: [
        { name: 'Run: 15s Sprint / 15s Rest', sets: 20, reps: 1, instructions: "Sprint at 100% for 15 seconds. Walk/jog slowly for 15 seconds. Repeat 20 times continuous.", alternative: "Rowing Intervals", bodyweight: "Shuttle Runs", hideWeight: true },
        { name: 'Drill: Box-to-Box Runs', sets: 4, reps: 1, instructions: "Run from goal line to opposite goal line in under 15s. Rest 45s. Repeat.", alternative: "Treadmill Sprints", bodyweight: "High Knees (30s on/30s off)", hideWeight: true },
        { name: 'Nordic Hamstring Curl', sets: 3, reps: 5, instructions: "Injury prevention maintenance. Control the descent.", alternative: "Hamstring Slider Curl", bodyweight: "Glute Bridge Walkouts", hideWeight: true }
      ]
    }
];

const POSITIONS = ["Goalkeeper", "Centre Back", "Full Back", "Wing Back", "Defensive Midfield", "Centre Midfield", "Attacking Midfield", "Winger", "Striker"];
const FEET = ["Right", "Left", "Both"];
const AGES = Array.from({length: 36}, (_, i) => i + 15);
const HEIGHTS = Array.from({length: 61}, (_, i) => i + 150);
const DEFENSIVE_POSITIONS = ["Goalkeeper", "Centre Back", "Full Back", "Wing Back"];

// --- UI Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", icon: Icon }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold uppercase tracking-wide text-sm transition-all active:scale-95 touch-manipulation select-none";
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100",
    danger: "bg-red-900/20 text-red-500 hover:bg-red-900/40 border border-red-900/50",
    ghost: "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Badge = ({ children, color = "zinc" }) => {
  const colors = {
    zinc: "bg-zinc-800 text-zinc-300",
    emerald: "bg-emerald-900/30 text-emerald-400 border border-emerald-900/50",
    blue: "bg-blue-900/30 text-blue-400 border border-blue-900/50",
    red: "bg-red-900/30 text-red-400 border border-red-900/50",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${colors[color]}`}>
      {children}
    </span>
  );
};

const Header = ({ title = "PROJECT ELITE FC", subtitle, onBack, rightAction, showLogo = true }) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md pb-4 pt-2 border-b border-zinc-900 mb-4 transition-all">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {onBack ? (
            <button 
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                onBack(); 
              }}
              className="h-12 w-12 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700 touch-manipulation active:scale-90"
            >
              <ChevronLeft size={24} />
            </button>
          ) : (
            showLogo && (
              <div className="h-12 w-12 rounded-xl bg-zinc-800 overflow-hidden flex items-center justify-center border border-zinc-700 shrink-0">
                 <img 
                   src="1766962304866.jpg" 
                   alt="Logo" 
                   className="h-full w-full object-cover"
                   onError={(e) => {
                     e.target.onerror = null; 
                     e.target.style.display = 'none';
                     e.target.parentNode.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-emerald-900"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>';
                   }}
                 />
              </div>
            )
          )}
          
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">
              {title}
            </h1>
            {subtitle && (
              <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-tight mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {rightAction && (
          <div className="flex items-center gap-2">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  );
};

// --- Sub-Components ---

const OnboardingModal = ({ profile, setProfile, onComplete }) => {
    const [localProfile, setLocalProfile] = useState(profile);

    const handleSave = () => {
        setProfile(localProfile);
        onComplete();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <Shield size={64} className="text-emerald-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">PROJECT ELITE FC</h1>
                    <p className="text-zinc-400">Welcome to the squad. Set up your player profile to begin.</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase">Player Name</label>
                        <input 
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white font-bold focus:border-emerald-500 outline-none mt-1"
                            value={localProfile.name}
                            onChange={(e) => setLocalProfile({...localProfile, name: e.target.value})}
                            placeholder="e.g. Jamie Tartt"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase">Current Club</label>
                        <input 
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white font-bold focus:border-emerald-500 outline-none mt-1"
                            value={localProfile.club}
                            onChange={(e) => setLocalProfile({...localProfile, club: e.target.value})}
                            placeholder="e.g. Richmond FC"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase">Position</label>
                            <div className="relative mt-1">
                                <select 
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white font-bold appearance-none focus:border-emerald-500 outline-none"
                                    value={localProfile.position}
                                    onChange={(e) => setLocalProfile({...localProfile, position: e.target.value})}
                                >
                                    {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-3.5 text-zinc-500 pointer-events-none"/>
                            </div>
                        </div>
                         <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase">Foot</label>
                            <div className="relative mt-1">
                                <select 
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white font-bold appearance-none focus:border-emerald-500 outline-none"
                                    value={localProfile.foot}
                                    onChange={(e) => setLocalProfile({...localProfile, foot: e.target.value})}
                                >
                                    {FEET.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-3.5 text-zinc-500 pointer-events-none"/>
                            </div>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase">Age</label>
                            <div className="relative mt-1">
                                <select 
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white font-bold appearance-none focus:border-emerald-500 outline-none"
                                    value={localProfile.age}
                                    onChange={(e) => setLocalProfile({...localProfile, age: parseInt(e.target.value)})}
                                >
                                    {AGES.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-3.5 text-zinc-500 pointer-events-none"/>
                            </div>
                        </div>
                         <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase">Height</label>
                            <div className="relative mt-1">
                                <select 
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white font-bold appearance-none focus:border-emerald-500 outline-none"
                                    value={parseInt(localProfile.height)}
                                    onChange={(e) => setLocalProfile({...localProfile, height: `${e.target.value}cm`})}
                                >
                                    {HEIGHTS.map(h => <option key={h} value={h}>{h}cm</option>)}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-3.5 text-zinc-500 pointer-events-none"/>
                            </div>
                        </div>
                    </div>
                </div>

                <Button onClick={handleSave} className="w-full py-4 text-lg">Create Player</Button>
            </div>
        </div>
    );
};

const DashboardView = ({ profile, seasonStats, history, setIsGameLogOpen, startWorkout, startRoutine, currentBlock, setCurrentBlock, setView }) => {
    const isDefensive = DEFENSIVE_POSITIONS.includes(profile.position);
    
    // Filter routines by the selected block (Phase)
    const blockRoutines = useMemo(() => {
        if (!currentBlock) return [];
        return FOOTBALL_ROUTINES.filter(r => r.phase === currentBlock);
    }, [currentBlock]);

    return (
      <div className="space-y-6 pb-24">
        <Header subtitle="Athlete Dashboard" />

        <div className="bg-zinc-900/50 border-l-4 border-emerald-500 p-4 mb-2 rounded-r-xl animate-in slide-in-from-left duration-500">
            <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                WELCOME, <span className="text-emerald-500">{profile.name.split(' ')[0]}</span>
            </h1>
            <p className="text-zinc-400 text-xs font-medium">Ready to dominate today?</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-emerald-900/20 border-emerald-900/50">
            <p className="text-zinc-400 text-xs font-bold uppercase">Appearances</p>
            <p className="text-3xl font-black text-white italic">{seasonStats.apps}</p>
            <p className="text-emerald-500 text-[10px] uppercase font-bold mt-1">Season Total</p>
          </Card>

          <Card className="bg-emerald-900/20 border-emerald-900/50">
            <p className="text-zinc-400 text-xs font-bold uppercase">Goals</p>
            <p className="text-3xl font-black text-white italic">{seasonStats.goals}</p>
            <p className="text-emerald-500 text-[10px] uppercase font-bold mt-1">Season Total</p>
          </Card>
          
          <Card className="bg-emerald-900/20 border-emerald-900/50">
            <p className="text-zinc-400 text-xs font-bold uppercase">Assists</p>
            <p className="text-3xl font-black text-white italic">{seasonStats.assists}</p>
            <p className="text-emerald-500 text-[10px] uppercase font-bold mt-1">Season Total</p>
          </Card>

          {isDefensive && (
            <Card className="bg-emerald-900/20 border-emerald-900/50">
                <p className="text-zinc-400 text-xs font-bold uppercase">Clean Sheets</p>
                <p className="text-3xl font-black text-white italic">{seasonStats.cleanSheets}</p>
                <p className="text-emerald-500 text-[10px] uppercase font-bold mt-1">Season Total</p>
            </Card>
          )}

          <Card>
            <p className="text-zinc-400 text-xs font-bold uppercase">Workouts</p>
            <p className="text-3xl font-black text-white italic">{history.length}</p>
            <p className="text-emerald-500 text-[10px] uppercase font-bold mt-1">Season Total</p>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
             <Button onClick={() => setIsGameLogOpen(true)} variant="secondary" icon={Trophy}>Log Match</Button>
             <Button onClick={startWorkout} variant="secondary" icon={Play}>Training</Button>
        </div>

        {/* Current Training Block Section */}
        <section>
           <div className="flex justify-between items-center mb-3">
               <h2 className="text-lg font-bold text-white italic">
                   {currentBlock ? `${currentBlock} Schedule` : "Current Training Block"}
               </h2>
               {currentBlock && (
                   <button onClick={() => setCurrentBlock(null)} className="text-zinc-500 hover:text-red-500 p-2">
                       <X size={16} />
                   </button>
               )}
           </div>
           
           {currentBlock ? (
             <div className="space-y-3">
                 <div className="grid grid-cols-1 gap-3">
                    {blockRoutines.map((routine, idx) => (
                    <button key={idx} onClick={() => startRoutine(routine)} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-left hover:bg-zinc-800 active:scale-[0.98] group relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${currentBlock === 'In-Season' ? 'bg-emerald-600' : currentBlock === 'Pre-Season' ? 'bg-orange-600' : 'bg-blue-600'} transition-colors`}></div>
                        <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-white text-sm">{routine.name}</h3>
                            <p className="text-zinc-400 text-[10px] mt-0.5 uppercase tracking-wide group-hover:text-zinc-300 transition-colors">{routine.focus}</p>
                        </div>
                        <Play size={16} className={`text-zinc-500 group-hover:${currentBlock === 'In-Season' ? 'text-emerald-500' : currentBlock === 'Pre-Season' ? 'text-orange-500' : 'text-blue-500'}`} />
                        </div>
                    </button>
                    ))}
                </div>
             </div>
           ) : (
             <div className="text-center py-6 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-xl">
                 <p className="text-zinc-500 text-sm mb-3">No active training block selected.</p>
                 <Button onClick={() => setView('workouts')} variant="secondary" className="text-xs">Select a Plan</Button>
             </div>
           )}
        </section>
      </div>
    );
};

const WorkoutsView = ({ startRoutine, setView, setCurrentBlock }) => {
    const [selectedRoutineForGuide, setSelectedRoutineForGuide] = useState(null);

    const routinesByPhase = useMemo(() => {
        const groups = {
            'In-Season': [],
            'Pre-Season': [],
            'Off-Season': []
        };
        FOOTBALL_ROUTINES.forEach(routine => {
            if (groups[routine.phase]) {
                groups[routine.phase].push(routine);
            }
        });
        return groups;
    }, []);

    const handleSelectBlock = (phase) => {
        setCurrentBlock(phase);
        setView('dashboard');
    };

    return (
        <div className="space-y-6 pb-24 animate-in fade-in">
            <Header title="PROJECT ELITE FC" subtitle="Training Library" onBack={() => setView('dashboard')} />
            
            <div className="space-y-6">
                {Object.entries(routinesByPhase).map(([phase, routines]) => (
                    <div key={phase}>
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="text-xs text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                <Circle size={8} className={`fill-${phase === 'In-Season' ? 'emerald' : phase === 'Pre-Season' ? 'orange' : 'blue'}-500 text-${phase === 'In-Season' ? 'emerald' : phase === 'Pre-Season' ? 'orange' : 'blue'}-500`} /> {phase}
                            </h3>
                            <button 
                                onClick={() => handleSelectBlock(phase)}
                                className="text-[10px] font-bold uppercase bg-zinc-800 px-3 py-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                            >
                                Select Block
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2">
                            {routines.map((routine) => (
                            <div 
                                key={routine.id} 
                                onClick={() => handleSelectBlock(phase)} 
                                className="relative flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl cursor-pointer hover:bg-zinc-800 active:scale-[0.98] group overflow-hidden transition-all"
                            >
                                <div className={`absolute top-0 left-0 w-1 h-full bg-${phase === 'In-Season' ? 'emerald' : phase === 'Pre-Season' ? 'orange' : 'blue'}-600`}></div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{routine.name}</h3>
                                    <p className="text-zinc-400 text-[10px] mt-0.5 uppercase tracking-wide">{routine.focus}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Info Button */}
                                    <div 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            setSelectedRoutineForGuide(routine); 
                                        }}
                                        className="text-zinc-500 hover:text-white p-2 rounded-full hover:bg-zinc-700/50 transition-colors z-10"
                                    >
                                        <Info size={18} />
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Routine Guide Modal */}
            {selectedRoutineForGuide && (
                <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedRoutineForGuide(null)}>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-0 w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-start bg-zinc-950/50 rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-black text-white italic uppercase">{selectedRoutineForGuide.name}</h2>
                                <p className="text-emerald-500 text-xs font-bold uppercase tracking-wider mt-1">{selectedRoutineForGuide.focus}</p>
                            </div>
                            <button onClick={() => setSelectedRoutineForGuide(null)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <div className="mb-6">
                                <h3 className="text-zinc-400 text-xs font-bold uppercase mb-2">Why this session?</h3>
                                <p className="text-zinc-200 text-sm leading-relaxed">{selectedRoutineForGuide.description}</p>
                            </div>

                            <h3 className="text-zinc-400 text-xs font-bold uppercase mb-3">Exercise Guide</h3>
                            <div className="space-y-4">
                                {selectedRoutineForGuide.exercises.map((ex, i) => (
                                    <div key={i} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-white font-bold text-sm">{ex.name}</h4>
                                            <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">{ex.sets} x {ex.reps > 0 ? ex.reps : 'Fail'}</span>
                                        </div>
                                        <p className="text-zinc-400 text-xs leading-normal mb-2">{ex.instructions || "Perform with control and focus on technique."}</p>
                                        
                                        {/* Alternatives Grid */}
                                        <div className="mt-2 pt-2 border-t border-zinc-800/50 grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-[9px] uppercase font-bold text-zinc-500">Gym Alt</p>
                                                <p className="text-zinc-300 text-[10px]">{ex.alternative || 'None'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] uppercase font-bold text-zinc-500">No Equipment</p>
                                                <p className="text-zinc-300 text-[10px]">{ex.bodyweight || 'None'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 rounded-b-2xl flex gap-3">
                            <button 
                                onClick={() => {
                                    handleSelectBlock(selectedRoutineForGuide.phase);
                                    setSelectedRoutineForGuide(null);
                                }}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl uppercase tracking-wide flex items-center justify-center gap-2"
                            >
                                Select Block
                            </button>
                            <button 
                                onClick={() => {
                                    startRoutine(selectedRoutineForGuide);
                                    setSelectedRoutineForGuide(null);
                                }}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl uppercase tracking-wide flex items-center justify-center gap-2"
                            >
                                <Play size={18} fill="currentColor" /> Start Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ActiveWorkoutView = ({ activeWorkout, setActiveWorkout, workoutTimer, finishWorkout, forceCancelWorkout, exercises }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleCancelRequest = () => setShowCancelModal(true);

    const updateSet = (exIdx, setIdx, field, val) => {
        const updated = [...activeWorkout.exercises];
        updated[exIdx].sets[setIdx][field] = val;
        setActiveWorkout({ ...activeWorkout, exercises: updated });
    };

    const addSet = (exIdx) => {
        const updated = [...activeWorkout.exercises];
        const prev = updated[exIdx].sets[updated[exIdx].sets.length-1];
        updated[exIdx].sets.push({ id: Date.now(), weight: prev?prev.weight:0, reps: prev?prev.reps:0, completed: false });
        setActiveWorkout({ ...activeWorkout, exercises: updated });
    };

    const removeSet = (exIdx, setIdx) => {
        const updated = [...activeWorkout.exercises];
        updated[exIdx].sets.splice(setIdx, 1);
        setActiveWorkout({ ...activeWorkout, exercises: updated });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
      <div className="space-y-6 pb-32">
        <Header 
          title="PROJECT ELITE FC" 
          subtitle="Active Session"
          onBack={handleCancelRequest} 
          rightAction={
             <div className="flex items-center gap-2 text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-900/50">
                <Clock size={14} />
                <span className="font-mono text-lg font-bold">{formatTime(workoutTimer)}</span>
             </div>
          }
        />
        
        <div className="px-1">
            <input 
                type="text" 
                value={activeWorkout.name} 
                onChange={(e) => setActiveWorkout({...activeWorkout, name: e.target.value})}
                className="bg-transparent text-2xl font-black italic text-white w-full focus:outline-none placeholder-zinc-700 tracking-tight"
                placeholder="WORKOUT NAME..."
            />
        </div>

        <div className="space-y-6">
          {activeWorkout.exercises.map((exercise, exIndex) => (
            <div key={exercise.instanceId} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-emerald-400 font-bold text-lg mb-2 pl-1 uppercase tracking-wide">{exercise.name}</h3>
              <Card className="overflow-hidden p-0">
                <div className="grid grid-cols-10 gap-2 bg-zinc-800/50 p-2 text-[10px] text-zinc-400 font-bold text-center uppercase tracking-widest">
                  <div className="col-span-1">Set</div>
                  <div className="col-span-3">kg</div>
                  <div className="col-span-3">Reps</div>
                  <div className="col-span-3">Done</div>
                </div>
                <div className="divide-y divide-zinc-800">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={set.id} className={`grid grid-cols-10 gap-2 p-3 items-center ${set.completed ? 'bg-emerald-900/10' : ''}`}>
                      <div className="col-span-1 text-center text-zinc-500 font-mono text-sm">{setIndex + 1}</div>
                      <div className="col-span-3">
                         {exercise.hideWeight ? (
                             <div className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded p-1 text-center text-zinc-600 font-mono text-sm select-none">-</div>
                         ) : (
                             <input type="number" placeholder="0" value={set.weight || ''} onChange={(e) => updateSet(exIndex, setIndex, 'weight', Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-center text-white focus:border-emerald-500 focus:outline-none font-bold"/>
                         )}
                      </div>
                      <div className="col-span-3"><input type="number" placeholder="0" value={set.reps || ''} onChange={(e) => updateSet(exIndex, setIndex, 'reps', Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-center text-white focus:border-emerald-500 focus:outline-none font-bold"/></div>
                      <div className="col-span-3 flex justify-center gap-2">
                        <button onClick={() => updateSet(exIndex, setIndex, 'completed', !set.completed)} className={`transition-all ${set.completed ? 'text-emerald-500 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}>{set.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}</button>
                        <button onClick={() => removeSet(exIndex, setIndex)} className="text-zinc-700 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 bg-zinc-800/30">
                  <button onClick={() => addSet(exIndex)} className="w-full py-2 text-xs font-bold text-emerald-500 hover:bg-emerald-900/20 rounded flex items-center justify-center gap-1 uppercase tracking-widest"><Plus size={14} /> Add Set</button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 pt-4">
          <Button variant="secondary" onClick={() => setIsAddModalOpen(true)} className="border-dashed border border-zinc-700"><Plus size={18} /> Add Exercise</Button>
          <div className="flex gap-2 mt-4">
              <Button onClick={handleCancelRequest} variant="danger" className="flex-1">Cancel Workout</Button>
              <Button onClick={finishWorkout} variant="primary" icon={Save} className="flex-[2]">Finish Workout</Button>
          </div>
        </div>

        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 w-full max-w-md rounded-2xl max-h-[80vh] flex flex-col">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-white font-bold uppercase tracking-wide">Select Exercise</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400">Close</button>
              </div>
              <div className="overflow-y-auto p-2">
                {exercises.map(ex => (
                  <button key={ex.id} onClick={() => { setActiveWorkout(prev => ({...prev, exercises: [...prev.exercises, {...ex, instanceId: Date.now(), sets: [{id: Date.now(), weight:0, reps:0, completed:false}]}]})); setIsAddModalOpen(false); }} className="w-full text-left p-4 hover:bg-zinc-800 rounded-lg flex justify-between items-center group">
                    <div><span className="text-zinc-200 font-bold block">{ex.name}</span><span className="text-xs text-zinc-500 uppercase tracking-wide">{ex.category}</span></div>
                    <Plus size={18} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {showCancelModal && (
            <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="bg-red-900/30 p-4 rounded-full mb-4"><AlertTriangle className="text-red-500" size={32} /></div>
                        <h3 className="text-xl font-bold text-white mb-2">Stop Workout?</h3>
                        <p className="text-zinc-400 text-sm">Progress will be lost.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setShowCancelModal(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl">Resume</button>
                        <button onClick={forceCancelWorkout} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl">End Session</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
};

const ProfileView = ({ profile, setProfile, seasonStats, setView }) => {
    const [editMode, setEditMode] = useState(false);
    const [localProfile, setLocalProfile] = useState(profile);

    const handleSave = () => {
        setProfile(localProfile);
        setEditMode(false);
    };

    return (
      <div className="space-y-6 pb-24 animate-in fade-in">
          <Header title="PLAYER PROFILE" subtitle="Career Stats" onBack={() => setView('dashboard')} />
          
          <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
              <div className="h-20 w-20 bg-emerald-900 rounded-full flex items-center justify-center border-2 border-emerald-500 text-emerald-400 font-black text-2xl shrink-0">
                  {profile.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                  {editMode ? (
                      <div>
                          <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Name</p>
                          <input className="bg-zinc-950 border border-zinc-700 rounded p-2 text-white w-full mb-2 font-bold text-sm focus:border-emerald-500 outline-none" value={localProfile.name} onChange={e => setLocalProfile({...localProfile, name: e.target.value})} />
                          <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Club</p>
                          <input className="bg-zinc-950 border border-zinc-700 rounded p-2 text-white w-full font-bold text-sm focus:border-emerald-500 outline-none" value={localProfile.club} onChange={e => setLocalProfile({...localProfile, club: e.target.value})} />
                      </div>
                  ) : (
                      <div>
                          <h2 className="text-2xl font-black text-white italic truncate">{profile.name}</h2>
                          <p className="text-emerald-500 font-bold uppercase text-xs truncate">{profile.club}</p>
                      </div>
                  )}
              </div>
              <button onClick={() => editMode ? handleSave() : setEditMode(true)} className="text-zinc-400 hover:text-white shrink-0 p-2">
                  {editMode ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Settings size={20} />}
              </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
               <Card>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Position</p>
                  {editMode ? (
                      <div className="relative">
                          <select 
                              className="bg-zinc-950 w-full text-white text-sm p-2 rounded appearance-none border border-zinc-700 focus:border-emerald-500"
                              value={localProfile.position}
                              onChange={e => setLocalProfile({...localProfile, position: e.target.value})}
                          >
                              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-3 text-zinc-500 pointer-events-none"/>
                      </div>
                  ) : (
                      <p className="text-white font-bold">{profile.position}</p>
                  )}
               </Card>
               <Card>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Foot</p>
                  {editMode ? (
                      <div className="relative">
                          <select 
                              className="bg-zinc-950 w-full text-white text-sm p-2 rounded appearance-none border border-zinc-700 focus:border-emerald-500"
                              value={localProfile.foot}
                              onChange={e => setLocalProfile({...localProfile, foot: e.target.value})}
                          >
                              {FEET.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-3 text-zinc-500 pointer-events-none"/>
                      </div>
                  ) : (
                      <p className="text-white font-bold">{profile.foot}</p>
                  )}
               </Card>
               <Card>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Age</p>
                  {editMode ? (
                      <div className="relative">
                          <select 
                              className="bg-zinc-950 w-full text-white text-sm p-2 rounded appearance-none border border-zinc-700 focus:border-emerald-500"
                              value={localProfile.age}
                              onChange={e => setLocalProfile({...localProfile, age: parseInt(e.target.value)})}
                          >
                              {AGES.map(a => <option key={a} value={a}>{a}</option>)}
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-3 text-zinc-500 pointer-events-none"/>
                      </div>
                  ) : (
                      <p className="text-white font-bold">{profile.age}</p>
                  )}
               </Card>
               <Card>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Height (cm)</p>
                  {editMode ? (
                      <div className="relative">
                          <select 
                              className="bg-zinc-950 w-full text-white text-sm p-2 rounded appearance-none border border-zinc-700 focus:border-emerald-500"
                              value={parseInt(localProfile.height)}
                              onChange={e => setLocalProfile({...localProfile, height: `${e.target.value}cm`})}
                          >
                              {HEIGHTS.map(h => <option key={h} value={h}>{h}cm</option>)}
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-3 text-zinc-500 pointer-events-none"/>
                      </div>
                  ) : (
                      <p className="text-white font-bold">{profile.height}</p>
                  )}
               </Card>
          </div>

          <div>
              <h3 className="text-white font-bold italic mb-3">Season Stats</h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                      <div className="text-2xl font-black text-white">{seasonStats.apps}</div>
                      <div className="text-[9px] text-zinc-500 uppercase font-bold">Apps</div>
                  </div>
                  <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                      <div className="text-2xl font-black text-white">{seasonStats.goals}</div>
                      <div className="text-[9px] text-zinc-500 uppercase font-bold">Goals</div>
                  </div>
                  <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                      <div className="text-2xl font-black text-white">{seasonStats.assists}</div>
                      <div className="text-[9px] text-zinc-500 uppercase font-bold">Assists</div>
                  </div>
                  <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                      <div className="text-2xl font-black text-white">{seasonStats.cleanSheets}</div>
                      <div className="text-[9px] text-zinc-500 uppercase font-bold">CS</div>
                  </div>
              </div>
          </div>
      </div>
    );
};

const DataView = ({ history, matchHistory, seasonStats, profile, setView, formatDate }) => { 
    const historyWithVolume = useMemo(() => {
        return history.map(h => {
            let vol = 0;
            h.exercises.forEach(ex => { ex.sets.forEach(s => { if(s.completed) vol += (s.weight * s.reps); }); });
            return { ...h, volume: vol };
        });
    }, [history]);
    
    const isDefensive = DEFENSIVE_POSITIONS.includes(profile.position);

    return (
        <div className="space-y-6 pb-24">
            <Header title="PROJECT ELITE FC" subtitle="Data & Statistics" onBack={() => setView('dashboard')} />
            
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Trophy className="text-emerald-500" size={18} />
                    <h2 className="text-lg font-bold text-white italic">Season Stats</h2>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-6">
                    <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                        <div className="text-xl font-black text-white">{seasonStats.apps}</div>
                        <div className="text-[9px] text-zinc-500 uppercase font-bold">Matches</div>
                    </div>
                    <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                        <div className="text-xl font-black text-white">{seasonStats.goals}</div>
                        <div className="text-[9px] text-zinc-500 uppercase font-bold">Goals</div>
                    </div>
                    <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                        <div className="text-xl font-black text-white">{seasonStats.assists}</div>
                        <div className="text-[9px] text-zinc-500 uppercase font-bold">Assists</div>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Activity className="text-blue-500" size={18} />
                    <h2 className="text-lg font-bold text-white italic">Match Log</h2>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                                <tr>
                                    <th className="p-3">Date</th>
                                    <th className="p-3 text-center">Result</th>
                                    <th className="p-3 text-center">Score</th>
                                    <th className="p-3 text-right">Stats</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800 text-zinc-300">
                                {matchHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-4 text-center text-zinc-500">No matches logged</td>
                                    </tr>
                                ) : (
                                    matchHistory.map((m) => (
                                        <tr key={m.id} className="hover:bg-zinc-800/50">
                                            <td className="p-3 font-mono text-xs text-zinc-400">{formatDate(m.date).slice(0, 6)}</td>
                                            <td className="p-3 text-center">
                                                <Badge color={m.result === 'Win' ? 'emerald' : m.result === 'Loss' ? 'red' : 'zinc'}>
                                                    {m.result ? m.result[0] : '-'}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-center font-mono text-xs">{m.homeScore}-{m.awayScore}</td>
                                            <td className="p-3 text-right text-xs">
                                                {m.goals > 0 && <span className="mr-1">{m.goals}G</span>}
                                                {m.assists > 0 && <span className="mr-1">{m.assists}A</span>}
                                                {isDefensive && m.cleanSheet && <span className="text-emerald-500 font-bold">CS</span>}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="text-orange-500" size={18} />
                    <h2 className="text-lg font-bold text-white italic">Workout Volume</h2>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                                <tr><th className="p-3">Date</th><th className="p-3">Workout</th><th className="p-3 text-right">Volume</th></tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800 text-zinc-300">
                                {historyWithVolume.map((h) => (
                                    <tr key={h.id} className="hover:bg-zinc-800/50">
                                        <td className="p-3 font-mono text-xs text-zinc-400">{formatDate(h.startTime)}</td>
                                        <td className="p-3 font-medium text-white">{h.name}</td>
                                        <td className="p-3 text-xs font-mono text-emerald-500 text-right">{h.volume} kg</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

const HistoryView = ({ history, setHistory, setView, formatDate }) => {
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    return (
      <div className="space-y-6 pb-24">
        <Header title="PROJECT ELITE FC" subtitle="Training Log" onBack={() => setView('dashboard')} />
        {confirmDeleteId && (
            <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm">
                    <h3 className="text-xl font-bold text-white mb-2">Delete Log?</h3>
                    <div className="flex gap-3">
                        <button onClick={() => setConfirmDeleteId(null)} className="flex-1 bg-zinc-800 text-white font-bold py-3 rounded-xl">Cancel</button>
                        <button onClick={() => { setHistory(history.filter(h => h.id !== confirmDeleteId)); setConfirmDeleteId(null); }} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl">Delete</button>
                    </div>
                </div>
            </div>
        )}
        {history.map(workout => (
            <Card key={workout.id} className="space-y-3 relative group">
              <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                <div><h3 className="font-bold text-lg text-white">{workout.name}</h3><div className="flex gap-3 text-xs text-zinc-400 mt-1"><span>{formatDate(workout.startTime)}</span></div></div>
              </div>
              <button onClick={() => setConfirmDeleteId(workout.id)} className="absolute top-4 right-4 text-zinc-500 hover:text-red-500 p-2"><Trash2 size={20} /></button>
            </Card>
        ))}
      </div>
    );
};

const GameLogModal = ({ saveGameStats, setIsGameLogOpen, isDefensive }) => {
    const [stats, setStats] = useState({ goals: 0, assists: 0, cleanSheet: false, result: 'Win', homeScore: 0, awayScore: 0 });
    const [matchDate, setMatchDate] = useState(new Date().toISOString().split('T')[0]);

    return (
      <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm overflow-y-auto max-h-[90vh]">
              <h3 className="text-xl font-bold text-white mb-6 text-center italic">Match Report</h3>
              <div className="space-y-4 mb-6">
                  <div className="flex flex-col gap-1 mb-2">
                      <label className="text-[10px] uppercase font-bold text-zinc-500">Match Date</label>
                      <div className="relative">
                          <input type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white text-sm font-bold focus:border-emerald-500 outline-none appearance-none" />
                          <CalendarDays className="absolute right-3 top-3 text-zinc-500 pointer-events-none" size={18} />
                      </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                      {['Win', 'Draw', 'Loss'].map(res => (
                          <button key={res} onClick={() => setStats({...stats, result: res})} className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${stats.result === res ? res === 'Win' ? 'bg-emerald-600 border-emerald-600 text-white' : res === 'Loss' ? 'bg-red-600 border-red-600 text-white' : 'bg-zinc-600 border-zinc-600 text-white' : 'bg-transparent border-zinc-700 text-zinc-400'}`}>{res.toUpperCase()}</button>
                      ))}
                  </div>
                  <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <div className="flex flex-col items-center gap-1">
                          <span className="text-xs text-zinc-500 uppercase font-bold">Home</span>
                          <div className="flex items-center gap-2"><button onClick={() => setStats({...stats, homeScore: Math.max(0, stats.homeScore - 1)})} className="h-8 w-8 rounded-full bg-zinc-800 text-white flex items-center justify-center"><Minus size={14}/></button><span className="text-xl font-mono text-white w-6 text-center">{stats.homeScore}</span><button onClick={() => setStats({...stats, homeScore: stats.homeScore + 1})} className="h-8 w-8 rounded-full bg-zinc-800 text-white flex items-center justify-center"><Plus size={14}/></button></div>
                      </div>
                      <span className="text-zinc-600 font-black text-xl">:</span>
                      <div className="flex flex-col items-center gap-1">
                          <span className="text-xs text-zinc-500 uppercase font-bold">Away</span>
                          <div className="flex items-center gap-2"><button onClick={() => setStats({...stats, awayScore: Math.max(0, stats.awayScore - 1)})} className="h-8 w-8 rounded-full bg-zinc-800 text-white flex items-center justify-center"><Minus size={14}/></button><span className="text-xl font-mono text-white w-6 text-center">{stats.awayScore}</span><button onClick={() => setStats({...stats, awayScore: stats.awayScore + 1})} className="h-8 w-8 rounded-full bg-zinc-800 text-white flex items-center justify-center"><Plus size={14}/></button></div>
                      </div>
                  </div>
                  <div className="h-px bg-zinc-800 my-4"></div>
                  <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <span className="text-white font-bold">Goals Scored</span>
                      <div className="flex items-center gap-3"><button onClick={() => setStats({...stats, goals: Math.max(0, stats.goals - 1)})} className="h-8 w-8 rounded-full bg-zinc-800 text-white flex items-center justify-center"><Minus size={14}/></button><span className="text-xl font-mono text-emerald-500 w-6 text-center">{stats.goals}</span><button onClick={() => setStats({...stats, goals: stats.goals + 1})} className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center"><Plus size={14}/></button></div>
                  </div>
                  <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <span className="text-white font-bold">Assists</span>
                      <div className="flex items-center gap-3"><button onClick={() => setStats({...stats, assists: Math.max(0, stats.assists - 1)})} className="h-8 w-8 rounded-full bg-zinc-800 text-white flex items-center justify-center"><Minus size={14}/></button><span className="text-xl font-mono text-emerald-500 w-6 text-center">{stats.assists}</span><button onClick={() => setStats({...stats, assists: stats.assists + 1})} className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center"><Plus size={14}/></button></div>
                  </div>
                  {isDefensive && (
                      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800" onClick={() => setStats({...stats, cleanSheet: !stats.cleanSheet})}>
                          <span className="text-white font-bold">Clean Sheet</span>
                          <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${stats.cleanSheet ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>{stats.cleanSheet && <CheckCircle2 size={16} className="text-black" />}</div>
                      </div>
                  )}
              </div>
              <div className="flex gap-3"><button onClick={() => setIsGameLogOpen(false)} className="flex-1 bg-zinc-800 text-white font-bold py-3 rounded-xl">Cancel</button><button onClick={() => saveGameStats(stats, matchDate)} className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl">Save Match</button></div>
          </div>
      </div>
    );
};

// --- Main Application ---

export default function App() {
  const [view, setView] = useState('dashboard'); 
  const [exercises, setExercises] = useState([
    { id: 1, name: 'Barbell/DB Bench Press', category: 'Push' },
    { id: 2, name: 'Squat', category: 'Legs' },
    { id: 3, name: 'Deadlift', category: 'Pull' },
    { id: 4, name: 'Overhead Press', category: 'Push' },
    { id: 5, name: 'Pull-Ups', category: 'Pull' },
    { id: 6, name: 'Dumbbell Row', category: 'Pull' },
    { id: 7, name: 'Lunge', category: 'Legs' },
    { id: 8, name: 'Front Squat', category: 'Legs' },
    { id: 9, name: 'Split Squat', category: 'Legs' },
    { id: 10, name: 'Plank', category: 'Core' },
    { id: 11, name: 'Landmine Press', category: 'Push' },
    { id: 12, name: 'Cable Woodchopper', category: 'Core' },
    { id: 13, name: 'Med Ball Side Toss', category: 'Core' },
    { id: 14, name: 'Explosive Push-Ups', category: 'Push' },
    { id: 15, name: 'Box Jumps', category: 'Legs' },
    { id: 16, name: 'Nordic Hamstring Curl', category: 'Legs' },
    { id: 17, name: 'Copenhagen Plank', category: 'Core' },
    { id: 18, name: 'Drill: Stop & Return', category: 'Agility' },
    { id: 19, name: 'Drill: Inside-Out', category: 'Agility' },
    { id: 20, name: 'Drill: Short & Sharp', category: 'Agility' },
    { id: 21, name: 'Drill: Diagonal Sprint', category: 'Cardio' },
    { id: 22, name: 'Drill: Lap Runner', category: 'Endurance' }
  ]);
  const [history, setHistory] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]); 
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [pinnedRoutine, setPinnedRoutine] = useState(null); // Add Pinned Routine State
  const [currentBlock, setCurrentBlock] = useState(null); // Add Current Block State
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [profile, setProfile] = useState({ name: "Elite Player", age: 21, height: "180cm", position: "Midfielder", foot: "Right", club: "Project Elite FC" });
  const [seasonStats, setSeasonStats] = useState({ apps: 0, goals: 0, assists: 0, cleanSheets: 0, wins: 0, draws: 0, losses: 0 });
  const [isGameLogOpen, setIsGameLogOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false); // State for Onboarding

  useEffect(() => {
    const savedHistory = localStorage.getItem('fitTrack_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedMatchHistory = localStorage.getItem('fitTrack_matchHistory');
    if (savedMatchHistory) setMatchHistory(JSON.parse(savedMatchHistory));
    
    const savedProfile = localStorage.getItem('fitTrack_profile');
    if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
    } else {
        setShowOnboarding(true); // Trigger onboarding if no profile exists
    }

    const savedStats = localStorage.getItem('fitTrack_stats');
    if (savedStats) setSeasonStats(JSON.parse(savedStats));
    
    const savedBlock = localStorage.getItem('fitTrack_currentBlock'); // Load current block
    if (savedBlock) setCurrentBlock(JSON.parse(savedBlock));
  }, []);

  useEffect(() => {
    localStorage.setItem('fitTrack_history', JSON.stringify(history));
    localStorage.setItem('fitTrack_matchHistory', JSON.stringify(matchHistory));
    localStorage.setItem('fitTrack_profile', JSON.stringify(profile));
    localStorage.setItem('fitTrack_stats', JSON.stringify(seasonStats));
    
    // Save current block
    if (currentBlock) {
      localStorage.setItem('fitTrack_currentBlock', JSON.stringify(currentBlock));
    } else {
      localStorage.removeItem('fitTrack_currentBlock');
    }
  }, [history, matchHistory, profile, seasonStats, currentBlock]);

  useEffect(() => {
    let interval;
    if (activeWorkout) {
      interval = setInterval(() => setWorkoutTimer(t => t + 1), 1000);
    } else {
      setWorkoutTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeWorkout]);

  const startWorkout = () => {
    setActiveWorkout({ id: Date.now(), startTime: new Date().toISOString(), name: 'New Workout', exercises: [] });
    setView('active');
  };

  const startRoutine = (routine) => {
    const routineExercises = routine.exercises.map(rEx => {
      const exerciseDef = exercises.find(e => e.name === rEx.name) || { name: rEx.name, category: 'General' };
      return {
        ...exerciseDef,
        ...rEx, // Merge specific routine props like hideWeight
        instanceId: Date.now() + Math.random(),
        sets: Array(rEx.sets).fill(0).map((_, i) => ({ id: Date.now() + Math.random() + i, weight: 0, reps: rEx.reps, completed: false }))
      };
    });
    setActiveWorkout({ id: Date.now(), startTime: new Date().toISOString(), name: routine.name, exercises: routineExercises });
    setView('active');
  };

  const finishWorkout = () => {
    setHistory([{ ...activeWorkout, endTime: new Date().toISOString(), duration: workoutTimer }, ...history]);
    setActiveWorkout(null);
    setWorkoutTimer(0);
    setView('dashboard');
  };

  const forceCancelWorkout = () => {
      setActiveWorkout(null);
      setWorkoutTimer(0);
      setView('dashboard');
  };

  const saveGameStats = (stats, matchDate) => {
      const newMatch = { id: Date.now(), date: matchDate, ...stats };
      setMatchHistory([newMatch, ...matchHistory]);
      setSeasonStats(prev => ({
          apps: prev.apps + 1,
          goals: prev.goals + stats.goals,
          assists: prev.assists + stats.assists,
          cleanSheets: prev.cleanSheets + (stats.cleanSheet ? 1 : 0),
          wins: prev.wins + (stats.result === 'Win' ? 1 : 0),
          draws: prev.draws + (stats.result === 'Draw' ? 1 : 0),
          losses: prev.losses + (stats.result === 'Loss' ? 1 : 0)
      }));
      setIsGameLogOpen(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      <div className="max-w-md mx-auto min-h-screen relative shadow-2xl shadow-black bg-zinc-950">
        <main className="p-4 pt-4">
          {view === 'dashboard' && <DashboardView profile={profile} seasonStats={seasonStats} history={history} setIsGameLogOpen={setIsGameLogOpen} startWorkout={startWorkout} startRoutine={startRoutine} currentBlock={currentBlock} setCurrentBlock={setCurrentBlock} setView={setView} />}
          {view === 'profile' && <ProfileView profile={profile} setProfile={setProfile} seasonStats={seasonStats} setView={setView} />}
          {view === 'active' && <ActiveWorkoutView activeWorkout={activeWorkout} setActiveWorkout={setActiveWorkout} workoutTimer={workoutTimer} finishWorkout={finishWorkout} forceCancelWorkout={forceCancelWorkout} exercises={exercises} />}
          {view === 'history' && <HistoryView history={history} setHistory={setHistory} setView={setView} formatDate={formatDate} />}
          {view === 'data' && <DataView history={history} matchHistory={matchHistory} seasonStats={seasonStats} profile={profile} setView={setView} formatDate={formatDate} />}
          {view === 'workouts' && <WorkoutsView startRoutine={startRoutine} setView={setView} setCurrentBlock={setCurrentBlock} />}
        </main>

        {isGameLogOpen && <GameLogModal saveGameStats={saveGameStats} setIsGameLogOpen={setIsGameLogOpen} isDefensive={DEFENSIVE_POSITIONS.includes(profile.position)} />}
        {showOnboarding && <OnboardingModal profile={profile} setProfile={setProfile} onComplete={() => setShowOnboarding(false)} />}

        {view !== 'active' && (
          <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 pb-safe z-50">
            <div className="max-w-md mx-auto flex justify-between px-6 py-3 items-end">
              <button onClick={() => setView('dashboard')} className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${view === 'dashboard' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <LayoutDashboard size={24} />
                Home
              </button>
              <button onClick={() => setView('workouts')} className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${view === 'workouts' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <Dumbbell size={24} />
                Plans
              </button>
              <div className="relative -top-5">
                <button 
                  onClick={startWorkout}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-lg border-4 border-zinc-950 transition-transform active:scale-95"
                >
                  <Plus size={28} />
                </button>
              </div>
              <button onClick={() => setView('data')} className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${view === 'data' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <BarChart2 size={24} />
                Stats
              </button>
              <button onClick={() => setView('profile')} className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${view === 'profile' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <User size={24} />
                Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
