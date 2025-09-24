/**
 * Typography Guide Component
 * Demonstrates the HOA Connect design system typography scale
 * Use this as reference for consistent font sizing throughout the app
 */

import React from 'react';

export function TypographyGuide() {
  return (
    <div className="space-y-8 p-8 bg-white rounded-card border border-ink-900/8">
      <div className="space-y-4">
        <h1 className="text-h1 font-bold text-ink-900">HOA Connect Typography System</h1>
        <p className="text-body text-ink-700">
          Consistent typography scale for professional brand experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Headers */}
        <div className="space-y-4">
          <h2 className="text-h2 font-semibold text-ink-900 border-b border-neutral-200 pb-2">Headers</h2>
          
          <div className="space-y-3">
            <div>
              <h1 className="text-h1 font-bold text-ink-900">H1 Heading (44px)</h1>
              <code className="text-caption text-neutral-600">text-h1 font-bold</code>
              <p className="text-caption text-neutral-500">Page titles, main headers</p>
            </div>
            
            <div>
              <h2 className="text-h2 font-semibold text-ink-900">H2 Heading (34px)</h2>
              <code className="text-caption text-neutral-600">text-h2 font-semibold</code>
              <p className="text-caption text-neutral-500">Section headers, major divisions</p>
            </div>
            
            <div>
              <h3 className="text-h3 font-semibold text-ink-900">H3 Heading (26px)</h3>
              <code className="text-caption text-neutral-600">text-h3 font-semibold</code>
              <p className="text-caption text-neutral-500">Subsection headers, card titles</p>
            </div>
            
            <div>
              <h4 className="text-h4 font-medium text-ink-900">H4 Heading (22px)</h4>
              <code className="text-caption text-neutral-600">text-h4 font-medium</code>
              <p className="text-caption text-neutral-500">Component titles, form labels</p>
            </div>
          </div>
        </div>

        {/* Body Text */}
        <div className="space-y-4">
          <h2 className="text-h2 font-semibold text-ink-900 border-b border-neutral-200 pb-2">Body Text</h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-body-lg text-ink-800">Body Large (18px)</p>
              <code className="text-caption text-neutral-600">text-body-lg</code>
              <p className="text-caption text-neutral-500">Introductory text, important descriptions</p>
            </div>
            
            <div>
              <p className="text-body text-ink-800">Body Text (16px)</p>
              <code className="text-caption text-neutral-600">text-body</code>
              <p className="text-caption text-neutral-500">Standard text, descriptions, content</p>
            </div>
            
            <div>
              <p className="text-caption text-ink-600">Caption Text (13px)</p>
              <code className="text-caption text-neutral-600">text-caption</code>
              <p className="text-caption text-neutral-500">Metadata, timestamps, helper text</p>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="space-y-4">
          <h2 className="text-h2 font-semibold text-ink-900 border-b border-neutral-200 pb-2">Usage Examples</h2>
          
          <div className="space-y-6">
            {/* Alert Box Example */}
            <div className="p-6 border border-neutral-200 rounded-lg">
              <h4 className="text-h4 font-semibold text-ink-900 mb-2">
                Alert/Message Title
              </h4>
              <p className="text-body text-ink-600 mb-1">
                Person Name
              </p>
              <p className="text-body text-ink-600 mb-2">
                1234 Property Address
              </p>
              <p className="text-caption text-neutral-600">
                Timestamp or status info
              </p>
            </div>

            {/* Card Example */}
            <div className="p-6 border border-neutral-200 rounded-lg">
              <h3 className="text-h3 font-semibold text-ink-900 mb-2">
                Card Title
              </h3>
              <p className="text-body text-ink-700 mb-4">
                Card description or content goes here using body text.
              </p>
              <p className="text-caption text-ink-600">
                Additional metadata or helper information
              </p>
            </div>
          </div>
        </div>

        {/* DO NOT USE */}
        <div className="space-y-4">
          <h2 className="text-h2 font-semibold text-red-600 border-b border-red-200 pb-2">❌ Avoid These</h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-body text-red-800 mb-2 font-medium">
              Do NOT use arbitrary Tailwind text sizes:
            </p>
            <ul className="text-caption text-red-700 space-y-1">
              <li>❌ <code>text-xs</code> → Use <code>text-caption</code></li>
              <li>❌ <code>text-sm</code> → Use <code>text-body</code></li>
              <li>❌ <code>text-base</code> → Use <code>text-body</code></li>
              <li>❌ <code>text-lg</code> → Use <code>text-body-lg</code> or <code>text-h4</code></li>
              <li>❌ <code>text-xl</code> → Use <code>text-h3</code></li>
              <li>❌ <code>text-2xl</code> → Use <code>text-h2</code></li>
              <li>❌ <code>text-3xl</code> → Use <code>text-h1</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypographyGuide;
