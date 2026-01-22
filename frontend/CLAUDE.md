# Frontend Guidelines - ZUM FLUX AI TODO APP

## Design System
- **Theme**: Neon Cyberpunk with animated gradient background
- **Primary Colors**: Cyan (#00d4ff), Pink (#ff006e), Purple (#b537f2)
- **Animations**: Floating text, gradient shifts, neon glow effects

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Custom CSS animations

## Key Features
- 🎨 Neon glow text effects with `.neon-glow` and `.neon-glow-pink` classes
- ✨ Animated gradient background (15s loop)
- 🚀 Floating animation on headers
- 💫 Neon border effects with `.neon-border` and `.neon-border-pink` classes
- 🌌 Semi-transparent dark cards with backdrop blur

## Patterns
- Use server components by default
- Client components only when needed (interactivity)
- API calls go through `/lib/api.ts`
- Apply neon styling to interactive elements

## Component Structure
- `/components` - Reusable UI components (TaskForm, etc.)
- `/app` - Pages and layouts (page.tsx, layout.tsx)
- `/lib` - API client and utilities

## Styling Guide
- Use neon color classes: `text-cyan-300`, `text-pink-300`, `text-purple-300`
- Apply glow effects: `neon-glow`, `neon-glow-pink`
- Use dark backgrounds: `bg-black/40`, `bg-black/20` with backdrop blur
- Border styling: `neon-border`, `neon-border-pink`
- Add transition effects for smooth interactions
- Always use `text-white` for main text

## CSS Custom Properties
```css
--neon-cyan: #00d4ff
--neon-pink: #ff006e
--neon-purple: #b537f2
--neon-green: #39ff14
```

## Typography
- App title: Large, bold, neon-glow effect with float animation
- Section titles: Medium, cyan-300 with neon-glow
- Labels: Smaller, cyan-300 with neon-glow
- Body text: white or gray-300

## API Client
All backend calls should use the api client:
```typescript
import { api } from '@/lib/api'
const tasks = await api.getTasks()
```

## Input Fields
- **Datetime inputs**: Use `colorScheme: 'dark'` inline style to make calendar icons visible with neon cyan color
- **Text color**: Use `text-cyan-300` for datetime inputs to match neon theme
- **Text inputs**: Always add `text-white` for visibility on dark backgrounds
- **Borders**: All inputs should have `border-cyan-500/50` for neon cyan borders

## Layout
- Use `grid grid-cols-2 gap-6` for side-by-side layouts (Create Task on left, Tasks list on right)
- Main container: `max-w-7xl` for full-width layouts with padding
- Cards: Always use `bg-black/40 backdrop-blur rounded-2xl p-8` for consistency
- Header: `max-w-6xl mx-auto` with sticky positioning

## Form Validation
- Show validation errors in neon pink: `text-pink-400 neon-glow-pink bg-pink-900/20`
- Display character counters in pink: `text-pink-300`
- Include 🚨 emoji for error messages
- Include ✨ and 🚀 emojis for success states