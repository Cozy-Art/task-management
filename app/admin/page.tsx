'use client';

/**
 * Admin Page
 * Manage app settings including Todoist color mappings
 */

import { useState } from 'react';
import Link from 'next/link';
import { TODOIST_COLORS } from '@/lib/utils/colors';

export default function AdminPage() {
  const [colorMappings, setColorMappings] = useState(TODOIST_COLORS);
  const [hasChanges, setHasChanges] = useState(false);

  const handleColorChange = (colorName: string, newHex: string) => {
    setColorMappings((prev) => ({
      ...prev,
      [colorName]: newHex,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save to localStorage for now
    localStorage.setItem('custom_color_mappings', JSON.stringify(colorMappings));
    setHasChanges(false);
    alert('Color mappings saved! Refresh the page to see changes.');
  };

  const handleReset = () => {
    if (confirm('Reset all colors to Todoist defaults?')) {
      setColorMappings(TODOIST_COLORS);
      localStorage.removeItem('custom_color_mappings');
      setHasChanges(false);
      alert('Colors reset to defaults! Refresh the page to see changes.');
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">⚙️ Admin Settings</h1>
              <p className="text-muted-foreground">
                Customize Todoist color mappings and app settings
              </p>
            </div>
          </div>
        </div>

        {/* Color Mappings Section */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Todoist Color Mappings</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Customize the hex colors used for each Todoist color name
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg border bg-background hover:bg-accent transition-colors text-sm font-medium"
              >
                Reset to Defaults
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  hasChanges
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-secondary text-muted-foreground cursor-not-allowed'
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Color Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(colorMappings)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([colorName, hexValue]) => (
                <div
                  key={colorName}
                  className="rounded-lg border p-4 space-y-3 hover:bg-accent/50 transition-colors"
                >
                  {/* Color Preview */}
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-lg border-2 border-border flex-shrink-0"
                      style={{ backgroundColor: hexValue }}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium capitalize">
                        {colorName.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {hexValue.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Color Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={hexValue}
                      onChange={(e) => handleColorChange(colorName, e.target.value)}
                      className="h-10 w-16 rounded cursor-pointer border border-border"
                      title={`Pick color for ${colorName}`}
                    />
                    <input
                      type="text"
                      value={hexValue}
                      onChange={(e) => handleColorChange(colorName, e.target.value)}
                      className="flex-1 h-10 rounded-md border bg-background px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="#000000"
                      pattern="^#[0-9A-Fa-f]{6}$"
                    />
                  </div>

                  {/* Reset Individual Color */}
                  {colorMappings[colorName] !== TODOIST_COLORS[colorName] && (
                    <button
                      onClick={() => handleColorChange(colorName, TODOIST_COLORS[colorName])}
                      className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Reset to default ({TODOIST_COLORS[colorName]})
                    </button>
                  )}
                </div>
              ))}
          </div>

          {/* Info Box */}
          <div className="mt-6 rounded-lg border bg-blue-50 dark:bg-blue-950/20 p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>💡 Note:</strong> Color changes are saved to your browser&apos;s local
              storage. You&apos;ll need to refresh the page after saving to see the changes applied
              throughout the app.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
