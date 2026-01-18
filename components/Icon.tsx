
import React from 'react';
import { 
  Home, 
  Sun, 
  Moon, 
  Calendar, 
  Pill, 
  Menu, 
  X, 
  ChevronLeft, 
  Sparkles, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Circle,
  Send,
  User,
  Utensils,
  Sprout,
  Dumbbell,
  Waves,
  Palette,
  Music,
  Plus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Heart,
  Stethoscope,
  Briefcase,
  Brain,
  Bone,
  Eye,
  Smile,
  Activity,
  Trash2,
  Settings,
  LogOut,
  Edit2,
  Phone,
  Mail,
  Award,
  Bell,
  Shield,
  Users,
  Type,
  Volume2,
  Check,
  Smartphone,
  FileText,
  Globe,
  Map,
  Battery,
  BatteryCharging,
  Zap,
  Navigation,
  Car,
  CloudSun,
  Sunset,
  Sunrise,
  Gamepad2,
  Puzzle,
  Calculator,
  Lightbulb,
  Trophy,
  Timer,
  RotateCcw,
  HelpCircle,
  MessageSquare,
  CreditCard,
  ClipboardList,
  FileBarChart,
  Download,
  Beaker,
  AlertTriangle,
  PhoneCall,
  CalendarClock,
  Accessibility,
  ZapOff,
  Dog,
  Cat,
  Fish,
  Droplet,
  Book,
  ShoppingBag,
  Coffee,
  Film,
  Tv,
  Footprints
} from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, className = "" }) => {
  const iconProps = {
    size: size,
    className: className,
    style: { width: size, height: size }
  };

  switch (name) {
    case 'home': return <Home {...iconProps} />;
    case 'sun': return <Sun {...iconProps} />;
    case 'church': return <Sun {...iconProps} />;
    case 'pool':
    case 'swimming': return <Waves {...iconProps} />;
    case 'cooking': return <Utensils {...iconProps} />;
    case 'gardening': return <Sprout {...iconProps} />;
    case 'exercise': return <Dumbbell {...iconProps} />;
    case 'art': return <Palette {...iconProps} />;
    case 'music': return <Music {...iconProps} />;
    case 'moon': return <Moon {...iconProps} />;
    case 'calendar': return <Calendar {...iconProps} />;
    case 'pill': return <Pill {...iconProps} />;
    case 'menu': return <Menu {...iconProps} />;
    case 'close': return <X {...iconProps} />;
    case 'back': return <ChevronLeft {...iconProps} />;
    case 'bot':
    case 'sparkles': return <Sparkles {...iconProps} />;
    case 'clock': return <Clock {...iconProps} />;
    case 'location':
    case 'map-pin': return <MapPin {...iconProps} />;
    case 'check': return <CheckCircle2 {...iconProps} />;
    case 'circle': return <Circle {...iconProps} />;
    case 'send': return <Send {...iconProps} />;
    case 'user': return <User {...iconProps} />;
    case 'plus': return <Plus {...iconProps} />;
    case 'chevron-right': return <ChevronRight {...iconProps} />;
    case 'chevron-down': return <ChevronDown {...iconProps} />;
    case 'chevron-up': return <ChevronUp {...iconProps} />;
    case 'star': return <Star {...iconProps} />;
    case 'heart': return <Heart {...iconProps} />;
    case 'stethoscope': return <Stethoscope {...iconProps} />;
    case 'briefcase': return <Briefcase {...iconProps} />;
    case 'brain': return <Brain {...iconProps} />;
    case 'bone': return <Bone {...iconProps} />;
    case 'eye': return <Eye {...iconProps} />;
    case 'smile': return <Smile {...iconProps} />;
    case 'activity': return <Activity {...iconProps} />;
    case 'trash': return <Trash2 {...iconProps} />;
    case 'settings': return <Settings {...iconProps} />;
    case 'log-out': return <LogOut {...iconProps} />;
    case 'edit': return <Edit2 {...iconProps} />;
    case 'phone': return <Phone {...iconProps} />;
    case 'mail': return <Mail {...iconProps} />;
    case 'award': return <Award {...iconProps} />;
    case 'bell': return <Bell {...iconProps} />;
    case 'shield': return <Shield {...iconProps} />;
    case 'users': return <Users {...iconProps} />;
    case 'type': return <Type {...iconProps} />;
    case 'volume': return <Volume2 {...iconProps} />;
    case 'check-plain': return <Check {...iconProps} />;
    case 'smartphone': return <Smartphone {...iconProps} />;
    case 'file-text': return <FileText {...iconProps} />;
    case 'globe': return <Globe {...iconProps} />;
    case 'map': return <Map {...iconProps} />;
    case 'battery': return <Battery {...iconProps} />;
    case 'battery-charging': return <BatteryCharging {...iconProps} />;
    case 'zap': return <Zap {...iconProps} />;
    case 'navigation': return <Navigation {...iconProps} />;
    case 'car': return <Car {...iconProps} />;
    case 'cloud-sun': return <CloudSun {...iconProps} />;
    case 'sunset': return <Sunset {...iconProps} />;
    case 'sunrise': return <Sunrise {...iconProps} />;
    case 'gamepad': return <Gamepad2 {...iconProps} />;
    case 'puzzle': return <Puzzle {...iconProps} />;
    case 'calculator': return <Calculator {...iconProps} />;
    case 'lightbulb': return <Lightbulb {...iconProps} />;
    case 'trophy': return <Trophy {...iconProps} />;
    case 'timer': return <Timer {...iconProps} />;
    case 'restart': return <RotateCcw {...iconProps} />;
    case 'help': return <HelpCircle {...iconProps} />;
    case 'message-square': return <MessageSquare {...iconProps} />;
    case 'credit-card': return <CreditCard {...iconProps} />;
    case 'clipboard': return <ClipboardList {...iconProps} />;
    case 'file-chart': return <FileBarChart {...iconProps} />;
    case 'download': return <Download {...iconProps} />;
    case 'beaker': return <Beaker {...iconProps} />;
    case 'droplet': return <Droplet {...iconProps} />;
    case 'alert': return <AlertTriangle {...iconProps} />;
    case 'phone-call': return <PhoneCall {...iconProps} />;
    case 'calendar-clock': return <CalendarClock {...iconProps} />;
    case 'accessibility': return <Accessibility {...iconProps} />;
    case 'zap-off': return <ZapOff {...iconProps} />;
    case 'dog': return <Dog {...iconProps} />;
    case 'cat': return <Cat {...iconProps} />;
    case 'fish': return <Fish {...iconProps} />;
    case 'reading': return <Book {...iconProps} />;
    case 'shopping': return <ShoppingBag {...iconProps} />;
    case 'coffee': return <Coffee {...iconProps} />;
    case 'movie': return <Film {...iconProps} />;
    case 'tv': return <Tv {...iconProps} />;
    case 'walking': return <Footprints {...iconProps} />;
    default: return <Sun {...iconProps} />;
  }
};
