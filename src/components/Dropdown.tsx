import React, { useState, useEffect, useRef } from 'react'

interface Option {
  key: string | number
  label: React.ReactNode
}

interface DropdownProps {
  trigger: React.ReactNode
  options: Option[]
  onSelect?: (key: string | number, option: Option) => void
  defaultOpen?: boolean
  backgroundColor?: string
  textColor?: string
  activeBackgroundColor?: string
  activeTextColor?: string
  className?: string
  disabled?: boolean
}

export default function Dropdown({
  trigger,
  options,
  onSelect,
  defaultOpen = false,
  backgroundColor = '#1f2937',
  textColor = '#ffffff',
  activeBackgroundColor = '#374151',
  activeTextColor = '#ffffff',
  className = '',
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [selectedKey, setSelectedKey] = useState<string | number | null>(null)
  const [hoverIndex, setHoverIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // 处理选择项
  const handleSelect = (key: string | number, option: Option) => {
    setSelectedKey(key)
    onSelect?.(key, option)
    setIsOpen(false)
    setHoverIndex(-1)
  }

  // 切换下拉菜单
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setHoverIndex(-1)
    }
  }

  // 处理鼠标悬停
  const handleMouseEnter = (index: number) => {
    setHoverIndex(index)
  }
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setHoverIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          setIsOpen(false)
          setHoverIndex(-1)
          break
        case 'ArrowDown':
          event.preventDefault()
          setHoverIndex((prevIndex) =>
            prevIndex < options.length - 1 ? prevIndex + 1 : 0
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setHoverIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : options.length - 1
          )
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (hoverIndex >= 0 && hoverIndex < options.length) {
            handleSelect(options[hoverIndex].key, options[hoverIndex])
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block ${className}`}
      aria-haspopup="true"
      aria-expanded={isOpen}
      tabIndex={0}
    >
      <div
        ref={triggerRef}
        onClick={toggleDropdown}
        className={`cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{ color: textColor }}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-disabled={disabled}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute z-50 mt-1 rounded-md shadow-lg overflow-hidden min-w-[160px]"
          style={{ backgroundColor }}
          role="menu"
          aria-labelledby="dropdownTrigger"
        >
          {options.map((option, index) => (
            <div
              key={option.key}
              onClick={(e) => {
                e.stopPropagation()
                handleSelect(option.key, option)
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              className={`px-4 py-2 cursor-pointer transition-colors focus:outline-none ${hoverIndex === index ? 'outline outline-2 outline-offset-0 outline-blue-500' : ''}`}
              style={{
                color: hoverIndex === index ? activeTextColor : textColor,
                backgroundColor:
                  hoverIndex === index ? activeBackgroundColor : 'transparent',
              }}
              role="menuitem"
              tabIndex={-1}
              id={`dropdown-option-${option.key}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
