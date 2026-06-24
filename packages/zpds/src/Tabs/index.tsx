import React from 'react'

type TabItem = {
  value: string | number
  label: string
}

type TabsProps = {
  list: (TabItem | string)[]
  value?: string | number
  defaultValue?: string
  name?: string
  onChange?: (value: string) => void
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  list,
  value,
  defaultValue,
  name,
  onChange,
  className = ''
}) => {
  const normalizedList: TabItem[] = list.map(item => 
    typeof item === 'string' ? { value: item, label: item } : item
  )

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChange?.(event.currentTarget.value)
  }

  return (
    <div className={`flex overflow-hidden rounded-xl bg-[var(--color-content)] p-1.5 flex-wrap gap-2 border border-[var(--color-netural)]/60 ${className}`}>
      {normalizedList.map((tab) => {
        const isSelected = value === tab.value
        return (
          <button
            key={tab.value}
            onClick={onClick}
            value={tab.value}
            type="button"
            className={`h-11 focus:outline-none flex-1 px-4 min-w-[100px] cursor-pointer flex items-center justify-center rounded-lg transition-all duration-200 ${
              isSelected 
                ? 'bg-[var(--color-primary)] text-[var(--color-base)] font-extrabold shadow-lg shadow-[var(--v3-magenta-glow)]' 
                : 'text-[var(--color-ink)]/65 hover:bg-[var(--color-netural)] hover:text-[var(--color-ink)]'
            }`}
          >
            <span className="text-sm tracking-wider font-bold">{tab.label}</span>
          </button>
        )
      })}
      {name && (
        <input type="hidden" name={name} value={defaultValue || value || ''} />
      )}
    </div>
  )
}

export default Tabs
