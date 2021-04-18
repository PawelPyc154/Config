import { TranslationKeys } from 'generated/translationKeys'
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import tw, { css } from 'twin.macro'

import debounce from 'utils/debounce'

type Positions = 'top' | 'bottom' | 'left' | 'right'
type Variants = 'primary'

export interface TooltipProps {
  content: TranslationKeys | ReactNode
  maxWidth?: string
  position?: Positions
  offsetPx?: number
  children: ReactNode
  hasArrow?: boolean
  variant?: Variants
}

interface TooltipPositions {
  positionFromLeft: number
  positionFromTop: number
}

const getTooltipPositions = (
  position: Positions,
  offsetPx: number,
  screenWidth: number,
  screenHeight: number,
  containerLeft: number,
  containerTop: number,
  containerWidth: number,
  containerHeight: number,
  tooltipWidth: number,
  tooltipHeight: number,
  hasArrow: boolean
): TooltipPositions => {
  const arrowOffset = hasArrow ? 7 : 0
  switch (position) {
    case 'top': {
      const positionLeft = containerLeft + containerWidth / 2 - tooltipWidth / 2
      const positionTop = containerTop - tooltipHeight - offsetPx + arrowOffset
      return {
        positionFromLeft:
          positionLeft + tooltipWidth >= screenWidth ? screenWidth - tooltipWidth : positionLeft,
        positionFromTop: positionTop > 0 ? positionTop : 0
      }
    }
    case 'bottom': {
      const positionLeft = containerLeft + containerWidth / 2 - tooltipWidth / 2
      const positionTop = containerTop + containerHeight + offsetPx + arrowOffset
      return {
        positionFromLeft:
          positionLeft + tooltipWidth >= screenWidth ? screenWidth - tooltipWidth : positionLeft,
        positionFromTop:
          positionTop + tooltipHeight < screenHeight ? positionTop : screenHeight - tooltipHeight
      }
    }
    case 'left': {
      const positionLeft = containerLeft - tooltipWidth - offsetPx + arrowOffset
      const positionTop = containerTop + containerHeight / 2 - tooltipHeight / 2
      return {
        positionFromLeft: positionLeft > 0 ? positionLeft : 0,
        positionFromTop:
          positionTop + tooltipHeight >= screenHeight ? screenHeight - tooltipHeight : positionTop
      }
    }
    case 'right': {
      const positionLeft = containerLeft + containerWidth + offsetPx + arrowOffset
      const positionTop = containerTop + containerHeight / 2 - tooltipHeight / 2
      return {
        positionFromLeft:
          positionLeft + tooltipWidth < screenWidth ? positionLeft : screenWidth - tooltipWidth,
        positionFromTop:
          positionTop + tooltipHeight >= screenHeight ? screenHeight - tooltipHeight : positionTop
      }
    }
    default: {
      throw new Error('Incorrect "position" property')
    }
  }
}

interface ArrowPositions {
  positionArrowFromLeft: number
  positionArrowFromTop: number
}
const getArrowPositions = (
  position: Positions,
  offsetPx: number,
  screenWidth: number,
  screenHeight: number,
  containerLeft: number,
  containerTop: number,
  containerWidth: number,
  containerHeight: number,
  tooltipWidth: number,
  tooltipHeight: number
): ArrowPositions => {
  switch (position) {
    case 'top': {
      const positionLeft = containerLeft + containerWidth / 2 - tooltipWidth / 2
      const positionTop = containerTop - tooltipHeight - offsetPx
      return {
        positionArrowFromLeft:
          positionLeft + tooltipWidth >= screenWidth ? screenWidth - tooltipWidth : positionLeft,
        positionArrowFromTop: positionTop > 0 ? positionTop : 0
      }
    }
    case 'bottom': {
      const positionLeft = containerLeft + containerWidth / 2 - tooltipWidth / 2
      const positionTop = containerTop + containerHeight + offsetPx
      return {
        positionArrowFromLeft:
          positionLeft + tooltipWidth >= screenWidth ? screenWidth - tooltipWidth : positionLeft,
        positionArrowFromTop:
          positionTop + tooltipHeight < screenHeight ? positionTop : screenHeight - tooltipHeight
      }
    }
    case 'left': {
      const positionLeft = containerLeft - tooltipWidth - offsetPx
      const positionTop = containerTop + containerHeight / 2 - tooltipHeight / 2
      return {
        positionArrowFromLeft: positionLeft > 0 ? positionLeft : 0,
        positionArrowFromTop:
          positionTop + tooltipHeight >= screenHeight ? screenHeight - tooltipHeight : positionTop
      }
    }
    case 'right': {
      const positionLeft = containerLeft + containerWidth + offsetPx

      const positionTop = containerTop + containerHeight / 2 - tooltipHeight / 2
      return {
        positionArrowFromLeft:
          positionLeft + tooltipWidth < screenWidth ? positionLeft : screenWidth - tooltipWidth,
        positionArrowFromTop:
          positionTop + tooltipHeight >= screenHeight ? screenHeight - tooltipHeight : positionTop
      }
    }
    default: {
      throw new Error('Incorrect "position" property')
    }
  }
}

const Tooltip = ({
  children,
  content,
  maxWidth,
  position = 'bottom',
  offsetPx = 0,
  hasArrow = true,
  variant = 'primary'
}: TooltipProps) => {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const [tooltipPositions, setTooltipPositions] = useState({
    positionFromLeft: 0,
    positionFromTop: 0
  })
  const [arrowPositions, setArrowPositions] = useState({
    positionArrowFromLeft: 0,
    positionArrowFromTop: 0
  })

  const setPositions = useCallback(() => {
    if (tooltipRef.current && containerRef.current) {
      const rectContainer = containerRef.current.getBoundingClientRect()
      setTooltipPositions(
        getTooltipPositions(
          position,
          offsetPx,
          window.screen.width,
          window.screen.height,
          rectContainer.x,
          rectContainer.y,
          rectContainer.width,
          rectContainer.height,
          tooltipRef.current?.offsetWidth,
          tooltipRef.current?.offsetHeight,
          hasArrow
        )
      )
      if (arrowRef.current) {
        setArrowPositions(
          getArrowPositions(
            position,
            offsetPx,
            window.screen.width,
            window.screen.height,
            rectContainer.x,
            rectContainer.y,
            rectContainer.width,
            rectContainer.height,
            arrowRef.current?.offsetWidth,
            arrowRef.current?.offsetHeight
          )
        )
      }
    }
  }, [hasArrow, offsetPx, position])

  useEffect(() => {
    const debouncedHandleResize = () => {
      if (isVisible) {
        debounce(() => {
          setPositions()
        }, 50)
      }
    }
    window.addEventListener('resize', debouncedHandleResize)
    window.addEventListener('scroll', debouncedHandleResize)
    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
      window.removeEventListener('scroll', debouncedHandleResize)
    }
  }, [isVisible, setPositions])

  useEffect(() => {
    setPositions()
  }, [content, maxWidth, position, offsetPx, setPositions])

  const [isRdy, setIsRdy] = useState(false)

  useEffect(() => {
    if (!document.getElementById('portal')) {
      const el = document.createElement('div')
      el.id = 'portal'
      document.body.appendChild(el)
    }
    setIsRdy(true)
  }, [])

  if (!children) return null

  const handleMouseEnter = () => {
    setPositions()
    setIsVisible(true)
  }
  const handleScroll = () => {
    console.log('scroll')
  }
  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  const { positionFromLeft, positionFromTop } = tooltipPositions
  const { positionArrowFromLeft, positionArrowFromTop } = arrowPositions

  const portal = isRdy ? document.getElementById('portal') : null

  return (
    <>
      {React.isValidElement(children) ? (
        React.cloneElement(React.Children.only(children), {
          ref: containerRef,
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          onScroll: handleScroll
        })
      ) : (
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onScroll={handleScroll}
        >
          {children}
        </div>
      )}

      {portal
        ? ReactDOM.createPortal(
            <Cloud
              ref={tooltipRef}
              isVisible={isVisible}
              style={{
                left: positionFromLeft || 0,
                top: positionFromTop || 0
              }}
            >
              {typeof content !== 'string' ? content : t(content)}
            </Cloud>,
            portal
          )
        : null}
      {hasArrow && portal
        ? ReactDOM.createPortal(
            <Arrow
              ref={arrowRef}
              variant={variant}
              isVisible={isVisible}
              position={position}
              style={{
                left: positionArrowFromLeft || 0,
                top: positionArrowFromTop || 0
              }}
            />,
            portal
          )
        : null}
    </>
  )
}

export { Tooltip }

interface CloudProps {
  isVisible: boolean
}

const Cloud = styled.div(({ isVisible }: CloudProps) => [
  tw`pointer-events-none inline-block font-sans text-2xs fixed bg-white text-black py-3 px-4 shadow-nav opacity-0 transition-opacity visible`,
  isVisible && css``,
  isVisible && tw`opacity-100`
])

interface ArrowProps {
  isVisible: boolean
  position: Positions
  variant: Variants
}

const Arrow = styled.div(({ isVisible, position, variant }: ArrowProps) => [
  tw`pointer-events-none fixed border-arrow border-transparent opacity-0 transition-opacity visible z-30`,
  position === 'left' &&
    css`
      border-right-width: 0;
      border-left-color: ${variant === 'primary' && 'white'};
    `,
  position === 'right' &&
    css`
      border-left-width: 0;
      border-right-color: ${variant === 'primary' && 'white'};
    `,
  position === 'top' &&
    css`
      border-bottom-width: 0;
      border-top-color: ${variant === 'primary' && 'white'};
    `,
  position === 'bottom' &&
    css`
      border-top-width: 0;
      border-bottom-color: ${variant === 'primary' && 'white'};
    `,
  isVisible && tw`opacity-100`
])
