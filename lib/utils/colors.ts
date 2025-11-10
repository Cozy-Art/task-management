/**
 * Todoist Color Mapping
 * Maps Todoist color names to hex color codes
 * Based on Todoist's official color palette
 */

export const TODOIST_COLORS: Record<string, string> = {
  berry_red: '#b8256f',
  red: '#db4035',
  orange: '#ff9933',
  yellow: '#fad000',
  olive_green: '#afb83b',
  lime_green: '#7ecc49',
  green: '#299438',
  mint_green: '#6accbc',
  teal: '#158FAD',
  sky_blue: '#14aaf5',
  light_blue: '#96c3eb',
  blue: '#4073ff',
  grape: '#884dff',
  violet: '#af38eb',
  lavender: '#eb96eb',
  magenta: '#e05194',
  salmon: '#ff8d85',
  charcoal: '#808080',
  grey: '#b8b8b8',
  taupe: '#ccac93',
};

/**
 * Get hex color from Todoist color name
 * Falls back to theme primary color if no match
 */
export function getTodoistColor(colorName: string | null | undefined): string {
  if (!colorName) {
    return '#3b82f6'; // Default blue-500 from theme
  }

  return TODOIST_COLORS[colorName] || '#3b82f6';
}
