import { Button } from '@/components/ui/Button';

export default function SpecimenPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Typography Scale */}
        <section>
          <h2 className="text-h2 font-semibold text-ink-900 mb-8">Typography Scale</h2>
          <div className="space-y-6">
            <div>
              <h1 className="text-h1 font-bold text-ink-900">Heading 1 - 44/52</h1>
              <p className="text-caption text-ink-800 mt-1">44px size, 52px line height</p>
            </div>
            <div>
              <h2 className="text-h2 font-semibold text-ink-900">Heading 2 - 34/42</h2>
              <p className="text-caption text-ink-800 mt-1">34px size, 42px line height</p>
            </div>
            <div>
              <h3 className="text-h3 font-medium text-ink-900">Heading 3 - 26/34</h3>
              <p className="text-caption text-ink-800 mt-1">26px size, 34px line height</p>
            </div>
            <div>
              <h4 className="text-h4 font-medium text-ink-900">Heading 4 - 22/30</h4>
              <p className="text-caption text-ink-800 mt-1">22px size, 30px line height</p>
            </div>
            <div>
              <p className="text-body text-ink-900">Body text - 16/26. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <p className="text-caption text-ink-800 mt-1">16px size, 26px line height</p>
            </div>
            <div>
              <p className="text-body-lg text-ink-900">Body Large - 18/28. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-caption text-ink-800 mt-1">18px size, 28px line height</p>
            </div>
            <div>
              <p className="text-caption text-ink-800">Caption text - 13/18</p>
              <p className="text-caption text-ink-800 mt-1">13px size, 18px line height</p>
            </div>
          </div>
        </section>

        {/* Button Variants & Sizes */}
        <section>
          <h2 className="text-h2 font-semibold text-ink-900 mb-8">Button Variants & Sizes</h2>
          
          <div className="space-y-8">
            {/* Primary Buttons */}
            <div>
              <h3 className="text-h4 font-medium text-ink-900 mb-4">Primary Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg">Large Primary</Button>
                <Button variant="primary" size="md">Medium Primary</Button>
                <Button variant="primary" size="sm">Small Primary</Button>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div>
              <h3 className="text-h4 font-medium text-ink-900 mb-4">Secondary Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" size="lg">Large Secondary</Button>
                <Button variant="secondary" size="md">Medium Secondary</Button>
                <Button variant="secondary" size="sm">Small Secondary</Button>
              </div>
            </div>

            {/* Ghost Buttons */}
            <div>
              <h3 className="text-h4 font-medium text-ink-900 mb-4">Ghost Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="ghost" size="lg">Large Ghost</Button>
                <Button variant="ghost" size="md">Medium Ghost</Button>
                <Button variant="ghost" size="sm">Small Ghost</Button>
              </div>
            </div>

            {/* Link Buttons */}
            <div>
              <h3 className="text-h4 font-medium text-ink-900 mb-4">Link Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="link" size="lg">Large Link</Button>
                <Button variant="link" size="md">Medium Link</Button>
                <Button variant="link" size="sm">Small Link</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-h2 font-semibold text-ink-900 mb-8">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-card border border-ink-900/8 bg-white shadow-elev1 p-6 md:p-8">
              <div className="text-caption uppercase tracking-wide text-ink-800 mb-2">Eyebrow Text</div>
              <h3 className="text-h3 font-medium text-ink-900 mb-4">Card Title</h3>
              <p className="text-body text-ink-800 mb-6">This is a sample card with the new design system. Notice the rounded corners, soft shadow, and proper spacing.</p>
              <div className="flex gap-3">
                <Button variant="primary" size="sm">Primary Action</Button>
                <Button variant="ghost" size="sm">Secondary Action</Button>
              </div>
            </div>
            
            <div className="rounded-card border border-ink-900/8 bg-neutral-50 shadow-elev1 p-6 md:p-8">
              <div className="text-caption uppercase tracking-wide text-ink-800 mb-2">On Neutral Background</div>
              <h3 className="text-h3 font-medium text-ink-900 mb-4">Another Card</h3>
              <p className="text-body text-ink-800">This card demonstrates the design system on a neutral background surface.</p>
            </div>
          </div>
        </section>

        {/* Spacing Samples */}
        <section>
          <h2 className="text-h2 font-semibold text-ink-900 mb-8">Spacing Samples</h2>
          
          <div className="space-y-8">
            <div className="bg-white border rounded-card p-6">
              <h3 className="text-h4 font-medium text-ink-900 mb-4">White Background</h3>
              <div className="space-y-2">
                {[8, 12, 16, 24, 32, 48, 64].map(size => (
                  <div key={size} className="flex items-center gap-4">
                    <div 
                      className="bg-primary rounded-ctl" 
                      style={{ width: `${size}px`, height: '12px' }}
                    />
                    <span className="text-body text-ink-900">{size}px</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-neutral-50 border rounded-card p-6">
              <h3 className="text-h4 font-medium text-ink-900 mb-4">Neutral Background</h3>
              <div className="space-y-2">
                {[8, 12, 16, 24, 32, 48, 64].map(size => (
                  <div key={size} className="flex items-center gap-4">
                    <div 
                      className="bg-accent rounded-ctl" 
                      style={{ width: `${size}px`, height: '12px' }}
                    />
                    <span className="text-body text-ink-900">{size}px</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}







