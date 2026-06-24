import React, { useState, useEffect, useRef } from 'react'

type TableProps = {
  children: React.ReactNode
  className?: string
}

export const TableComponent: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full overflow-hidden rounded-xl border border-[var(--color-netural)] bg-[var(--color-content)] shadow-[var(--v3-border-glow)] ${className}`}>
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  )
}

type ThProps = {
  children: React.ReactNode
  className?: string
}

export const Th: React.FC<ThProps> = ({ children, className = '' }) => {
  return (
    <th className={`p-3 text-center bg-[var(--color-netural)] text-[var(--color-ink)] font-bold text-sm border-b border-[var(--color-netural)]/80 ${className}`}>
      {children}
    </th>
  )
}

type TdProps = {
  value: number | string
  name?: string
  append?: React.ReactNode
  onChange?: (val: string) => void
  className?: string
  isEditable?: boolean
}

export const Td: React.FC<TdProps> = ({
  value,
  name,
  append,
  onChange,
  className = '',
  isEditable = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEdit, setIsEdit] = useState(false)

  const onEditClick = () => {
    if (isEditable && onChange) {
      setIsEdit(true)
    }
  }

  const onBlur = () => {
    setIsEdit(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  useEffect(() => {
    if (isEdit) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEdit])

  return (
    <td className={`text-center h-14 bg-[var(--color-base)]/40 text-[var(--color-ink)] border-b border-t border-l border-r border-[var(--color-netural)]/60 relative group/td hover:bg-[var(--color-netural)]/20 transition-all ${className}`}>
      {isEdit ? (
        <input
          ref={inputRef}
          type="text"
          className="w-full text-center h-full block px-2 bg-[var(--color-content)] border-none outline-none text-[var(--color-primary)] font-extrabold text-sm"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          name={name}
        />
      ) : (
        <button
          onClick={onEditClick}
          disabled={!isEditable}
          className={`w-full h-full cursor-pointer flex flex-col items-center justify-center text-xs font-semibold focus:outline-none ${
            isEditable ? 'hover:text-[var(--color-secondary)]' : ''
          }`}
          type="button"
        >
          <span>{value}</span>
          {append}
        </button>
      )}
    </td>
  )
}

export const Table = Object.assign(TableComponent, {
  Th,
  Td,
})

export default Table
