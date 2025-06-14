"use client"

import * as React from "react"
import { cn } from "lib/utils"

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onFilesAdded: (files: File[]) => void
  multiple?: boolean
  accept?: string
  children: React.ReactNode
}

interface FileUploadTriggerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
  className?: string
  children: React.ReactNode
}

interface FileUploadContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

const FileUpload = ({
  onFilesAdded,
  multiple = true,
  accept,
  children,
  ...props
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter((file) => {
      if (accept) {
        const acceptedTypes = accept.split(",").map((type) => type.trim())
        const fileExtension = `.${file.name.split(".").pop()}`
        return acceptedTypes.includes(fileExtension) || acceptedTypes.includes(file.type)
      }
      return true
    })

    if (files.length > 0) {
      onFilesAdded(multiple ? files : [files[0]])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) => {
      if (accept) {
        const acceptedTypes = accept.split(",").map((type) => type.trim())
        const fileExtension = `.${file.name.split(".").pop()}`
        return acceptedTypes.includes(fileExtension) || acceptedTypes.includes(file.type)
      }
      return true
    })

    if (files.length > 0) {
      onFilesAdded(multiple ? files : [files[0]])
    }
  }

  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === FileUploadTrigger) {
        return React.cloneElement(child as React.ReactElement<FileUploadTriggerProps>, {
          onClick: () => inputRef.current?.click(),
          ref: triggerRef,
        })
      }
      if (child.type === FileUploadContent && isDragging) {
        return React.cloneElement(child as React.ReactElement<FileUploadContentProps>, {
          className: cn(child.props.className, "absolute inset-0 z-50"),
        })
      }
    }
    return child
  })

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative"
      {...props}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple={multiple}
        accept={accept}
      />
      {childrenWithProps}
    </div>
  )
}

const FileUploadTrigger = React.forwardRef<
  HTMLButtonElement,
  FileUploadTriggerProps
>(({ className, children, asChild = false, ...props }, ref) => {
  const Comp = asChild ? "div" : "button" // Changed to div for asChild to work with non-button elements
  return (
    <Comp
      className={cn(className)}
      ref={ref}
      {...props}
    >
      {children}
    </Comp>
  )
})
FileUploadTrigger.displayName = "FileUploadTrigger"

const FileUploadContent = React.forwardRef<
  HTMLDivElement,
  FileUploadContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  )
})
FileUploadContent.displayName = "FileUploadContent"

export { FileUpload, FileUploadContent, FileUploadTrigger }