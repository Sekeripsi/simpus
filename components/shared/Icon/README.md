# Icon Component System - SIMPUS

A comprehensive, accessible, and type-safe icon component system for the SIMPUS healthcare management application built on **Lucide React**.

## 📦 What's Included

- **Icon Wrapper** (`Icon.tsx`) - Base component with size and color variants
- **Icon Presets** (`presets.tsx`) - 40+ pre-configured icons for common use cases
- **Usage Guide** (`USAGE.md.tsx`) - Extensive examples and patterns
- **Test Suite** (`Icon.test.tsx`) - Comprehensive unit tests with React Testing Library
- **Barrel Export** (`Icon.ts`) - Convenient import shortcuts

## 🚀 Quick Start

### Basic Import & Usage

```tsx
import { UserIcon, MedicalRecordIcon, SuccessIcon } from '@/components/shared/Icon'

export function MyComponent() {
  return (
    <div className="flex items-center gap-2">
      <UserIcon size="md" color="primary" />
      <span>John Doe</span>
    </div>
  )
}
```

### Using the Base Icon Component

```tsx
import { Icon } from '@/components/shared/Icon'
import { Calendar, Stethoscope, Heart } from 'lucide-react'

export function AppointmentCard() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon icon={Calendar} size="md" color="primary" />
        <span>Schedule Appointment</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon={Stethoscope} size="md" color="primary" />
        <span>Doctor's Consultation</span>
      </div>
    </div>
  )
}
```

## 📐 Size Variants

Five semantic sizes that match common UI patterns:

| Size | Class      | Pixels | Use Case |
|------|-----------|--------|----------|
| `xs` | `h-3 w-3` | 12px   | Tiny labels, badges |
| `sm` | `h-4 w-4` | 16px   | Form labels, breadcrumbs |
| `md` | `h-5 w-5` | 20px   | **Default**, standard usage |
| `lg` | `h-6 w-6` | 24px   | Prominent actions, headers |
| `xl` | `h-8 w-8` | 32px   | Hero sections, large displays |

```tsx
<UserIcon size="xs" />  {/* 12px */}
<UserIcon size="sm" />  {/* 16px */}
<UserIcon size="md" />  {/* 20px — default */}
<UserIcon size="lg" />  {/* 24px */}
<UserIcon size="xl" />  {/* 32px */}
```

## 🎨 Color Variants

Six semantic color options that integrate with Tailwind CSS and theme tokens:

| Color | Class | Purpose |
|-------|-------|---------|
| `default` | `text-foreground` | Standard text color |
| `primary` | `text-primary` | Brand color, emphasis |
| `success` | `text-green-500` | Confirmations, checkmarks |
| `warning` | `text-amber-500` | Cautions, alerts |
| `destructive` | `text-destructive` | Errors, delete actions |
| `muted` | `text-muted-foreground` | Secondary information |

```tsx
<UserIcon color="default" />      {/* Standard */}
<UserIcon color="primary" />      {/* Brand color */}
<SuccessIcon color="success" />   {/* Green checkmark */}
<WarningIcon color="warning" />   {/* Amber alert */}
<ErrorIcon color="destructive" /> {/* Red error */}
<UserIcon color="muted" />        {/* Subtle */}
```

## 🎯 Available Icon Presets

### Auth & User
- `UserIcon` - User profile
- `MailIcon` - Email/contact
- `LockIcon` - Locked/security
- `LogOutIcon` - Sign out

### Navigation
- `MenuIcon` - Hamburger menu
- `CloseIcon` - Close/dismiss
- `HomeIcon` - Home/dashboard
- `ChevronDownIcon` - Dropdown indicator
- `ChevronRightIcon` - Next/forward
- `BackIcon` - Back/previous

### Healthcare & Medical
- `StethoscopeIcon` - Doctor/diagnosis (primary color)
- `HeartIcon` - Heart/vitals (destructive color)
- `MedicalRecordIcon` - Patient records/clipboard

### Documents & Files
- `DocumentIcon` - File/document
- `PatientsIcon` - Multiple users/staff

### Actions
- `SettingsIcon` - Configuration
- `AddIcon` - Create/add new
- `SearchIcon` - Find/search
- `EditIcon` - Modify/edit
- `DeleteIcon` - Remove (destructive)
- `SaveIcon` - Save/confirm (success)

### Status & Feedback
- `SuccessIcon` - Completion (green)
- `ErrorIcon` - Problem (red)
- `WarningIcon` - Caution (amber)
- `InfoIcon` - Information (primary)
- `LoadingIcon` - Loading spinner with animation

### Visibility
- `ShowIcon` - Reveal/unhide
- `HideIcon` - Conceal/hide

### Time & Location
- `CalendarIcon` - Date/appointment
- `ClockIcon` - Time/schedule
- `LocationIcon` - Address/location
- `PhoneIcon` - Contact/call

### File Transfer
- `DownloadIcon` - Save/receive
- `UploadIcon` - Send/submit

## 🧩 Common Patterns

### In Button Groups
```tsx
import { Button } from '@/components/ui/button'
import { AddIcon, EditIcon, DeleteIcon } from '@/components/shared/Icon'

export function ActionButtons() {
  return (
    <div className="flex gap-2">
      <Button>
        <AddIcon size="sm" className="mr-2" />
        New
      </Button>
      <Button variant="outline">
        <EditIcon size="sm" className="mr-2" />
        Edit
      </Button>
      <Button variant="destructive">
        <DeleteIcon size="sm" className="mr-2" />
        Delete
      </Button>
    </div>
  )
}
```

### In Form Labels
```tsx
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { MailIcon, LockIcon } from '@/components/shared/Icon'

export function LoginForm() {
  return (
    <>
      <div>
        <Label className="flex items-center gap-2">
          <MailIcon size="sm" color="primary" />
          Email
        </Label>
        <Input type="email" />
      </div>
      <div>
        <Label className="flex items-center gap-2">
          <LockIcon size="sm" color="primary" />
          Password
        </Label>
        <Input type="password" />
      </div>
    </>
  )
}
```

### In Alerts
```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SuccessIcon, ErrorIcon, WarningIcon } from '@/components/shared/Icon'

export function AlertExamples() {
  return (
    <>
      <Alert>
        <SuccessIcon size="md" className="mr-2" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Operation completed.</AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <ErrorIcon size="md" className="mr-2" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
    </>
  )
}
```

### In Tables
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UserIcon, SuccessIcon, EditIcon, DeleteIcon } from '@/components/shared/Icon'

export function PatientTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="flex items-center gap-2">
            <UserIcon size="sm" />
            Name
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="flex items-center gap-2">
            <UserIcon size="sm" />
            John Doe
          </TableCell>
          <TableCell className="flex items-center gap-2">
            <SuccessIcon size="sm" />
            Active
          </TableCell>
          <TableCell className="flex gap-2">
            <EditIcon size="sm" className="cursor-pointer" />
            <DeleteIcon size="sm" className="cursor-pointer" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
```

### Loading States
```tsx
import { LoadingIcon } from '@/components/shared/Icon'

export function LoadingState() {
  return (
    <div className="flex items-center gap-2">
      <LoadingIcon size="md" />
      <span>Loading patient records...</span>
    </div>
  )
}
```

## ♿ Accessibility

The Icon component includes built-in accessibility features:

### Decorative Icons (hidden from screen readers)
```tsx
{/* Icon is semantic to the text, so it's hidden */}
<div className="flex items-center gap-2">
  <SuccessIcon decorative size="sm" />
  <span>Operation completed successfully</span>
</div>
```

### Meaningful Icons (labeled for screen readers)
```tsx
{/* Icon is the main information */}
<button aria-label="Save changes">
  <SaveIcon size="md" />
</button>
```

### Keyboard Navigation
Interactive icons support:
- **Click** - Standard mouse interaction
- **Enter** - Keyboard activation
- **Space** - Alternative keyboard activation
- **Tab** - Focus management

```tsx
<Icon
  icon={Settings}
  onClick={handleSettings}
  ariaLabel="Open settings"
/>
```

## 🧪 Testing

All icon components are fully tested with React Testing Library. Run tests:

```bash
npm test Icon.test.tsx
npm run test:coverage
```

### Testing Your Icon Usage
```tsx
import { render, screen } from '@testing-library/react'
import { UserIcon } from '@/components/shared/Icon'

it('renders user icon', () => {
  render(<UserIcon ariaLabel="user" decorative />)
  const icon = screen.getByRole('img', { hidden: true })
  expect(icon).toBeInTheDocument()
})
```

## 🔧 TypeScript Support

Full TypeScript support with type-safe props:

```tsx
import { Icon, type IconProps } from '@/components/shared/Icon'

// Type-checked props
const iconProps: IconProps = {
  icon: UserIcon,
  size: 'md',        // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color: 'primary',  // 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'muted'
  className: 'mr-2',
  ariaLabel: 'User profile',
  decorative: false,
  onClick: () => {},
}
```

## 📚 Adding New Icons

### Add a Preset Icon
1. Import the Lucide icon:
   ```tsx
   import { YourIcon } from 'lucide-react'
   ```

2. Create a preset function in `presets.tsx`:
   ```tsx
   export const YourIcon = (props: Omit<IconProps, 'icon'>) => (
     <Icon icon={YourIcon} size={props.size || 'md'} color={props.color || 'primary'} {...props} />
   )
   ```

3. Export it from the barrel export (`Icon.ts`)

### Use Any Lucide Icon Directly
```tsx
import { Icon } from '@/components/shared/Icon'
import { AlertTriangle, TrendingUp, Users } from 'lucide-react'

<Icon icon={AlertTriangle} size="lg" color="warning" />
<Icon icon={TrendingUp} size="md" color="success" />
<Icon icon={Users} size="md" />
```

## 🎨 Customizing Colors

### Add Theme Colors
Colors use Tailwind CSS custom properties. Modify `globals.css`:

```css
@theme inline {
  /* ... existing theme ... */

  /* Add custom icon colors */
  --color-icon-medical: oklch(0.488 0.243 264.376);  /* Medical blue */
  --color-icon-alert: oklch(0.637 0.237 15.163);     /* Alert red */
}
```

Then use in presets:
```tsx
export const MedicalIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Stethoscope} size={props.size || 'md'} className="text-[var(--color-icon-medical)]" {...props} />
)
```

## 📖 File Structure

```
app/components/shared/Icon/
├── index.tsx          # Base Icon component
├── presets.tsx        # Icon presets (40+ icons)
├── USAGE.md.tsx       # Extensive examples
└── Icon.ts            # Barrel export

__tests__/
└── components/shared/
    └── Icon.test.tsx  # Test suite
```

## ✨ Performance

- **Tree-shaking friendly** - Only import what you use
- **No runtime overhead** - Pure CSS classes
- **No additional dependencies** - Built on Lucide React + Tailwind CSS
- **Optimized rendering** - Uses `React.forwardRef` for performance

## 🚀 Next Steps

1. **Use icons in your components** - Import presets and start building
2. **Add custom presets** - Create domain-specific icon shortcuts
3. **Run tests** - Verify icon behavior: `npm test Icon.test.tsx`
4. **Review examples** - See `USAGE.md.tsx` for all patterns

## 📖 Resources

- **Lucide React** - https://lucide.dev
- **Tailwind CSS** - https://tailwindcss.com
- **shadcn/ui** - https://ui.shadcn.com
- **Accessibility** - https://www.w3.org/WAI/test-evaluate/

## 💡 Tips

- **Default to `md` size** - It matches standard form input heights
- **Use presets** - They handle semantic sizing and coloring
- **Combine with text** - Icons work best with accompanying labels
- **Test accessibility** - Use `ariaLabel` for interactive icons
- **Keep it simple** - One icon, one purpose

---

**Created for SIMPUS** - A comprehensive healthcare management system for community health centers.
