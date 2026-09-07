/**
 * Icon Presets
 *
 * Pre-configured icon components for common SIMPUS use cases.
 * Combines Icon wrapper with specific Lucide icons for consistent semantic usage.
 *
 * Usage:
 * import { UserIcon, DashboardIcon, MedicalRecordIcon } from '@/components/shared/Icon/presets'
 * <UserIcon /> // Medium size, default color
 * <DashboardIcon size="lg" />
 */

import {
  User,
  Mail,
  Lock,
  LogOut,
  Menu,
  X,
  Home,
  FileText,
  Users,
  Settings,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Stethoscope,
  Heart,
  ClipboardList,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Loader2,
  Save,
  Trash2,
  Edit2,
  Download,
  Upload,
} from 'lucide-react'
import { Icon, type IconProps } from './index'
import React from 'react'

/**
 * Auth & User Icons
 */
export const UserIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={User} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const MailIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Mail} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const LockIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Lock} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const LogOutIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={LogOut} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

/**
 * Navigation Icons
 */
export const MenuIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Menu} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const CloseIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={X} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const HomeIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Home} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const ChevronDownIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={ChevronDown} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const ChevronRightIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={ChevronRight} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const BackIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={ArrowLeft} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

/**
 * Healthcare & Medical Icons
 */
export const StethoscopeIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Stethoscope} size={props.size || 'md'} color={props.color || 'primary'} {...props} />
)

export const HeartIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Heart} size={props.size || 'md'} color={props.color || 'destructive'} {...props} />
)

export const MedicalRecordIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={ClipboardList} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

/**
 * Document & File Icons
 */
export const DocumentIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={FileText} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const PatientsIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Users} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

/**
 * Action Icons
 */
export const SettingsIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Settings} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const AddIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Plus} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const SearchIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Search} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const EditIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Edit2} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const DeleteIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Trash2} size={props.size || 'md'} color={props.color || 'destructive'} {...props} />
)

export const SaveIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Save} size={props.size || 'md'} color={props.color || 'success'} {...props} />
)

/**
 * Status Icons
 */
export const SuccessIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={CheckCircle2} size={props.size || 'md'} color={props.color || 'success'} {...props} />
)

export const ErrorIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={AlertCircle} size={props.size || 'md'} color={props.color || 'destructive'} {...props} />
)

export const WarningIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={AlertCircle} size={props.size || 'md'} color={props.color || 'warning'} {...props} />
)

export const InfoIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Info} size={props.size || 'md'} color={props.color || 'primary'} {...props} />
)

export const LoadingIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Loader2} size={props.size || 'md'} color={props.color || 'default'} className="animate-spin" {...props} />
)

/**
 * Visibility Icons
 */
export const ShowIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Eye} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const HideIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={EyeOff} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

/**
 * Time & Calendar Icons
 */
export const CalendarIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Calendar} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const ClockIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Clock} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const LocationIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={MapPin} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const PhoneIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Phone} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

/**
 * File Transfer Icons
 */
export const DownloadIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Download} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)

export const UploadIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Upload} size={props.size || 'md'} color={props.color || 'default'} {...props} />
)
