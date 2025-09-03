import { MotiView } from "moti"
import * as React from "react"
import { Dimensions, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Easing } from "react-native-reanimated"
import RemixIcon from "react-native-remix-icon"

// Context for sharing toggle state
const ActionSheetContext = React.createContext<{
  toggleHeight?: () => void
  isFullHeight?: boolean
}>({})

const useActionSheet = () => React.useContext(ActionSheetContext)

interface ActionSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface ActionSheetContentProps {
  className?: string
  children: React.ReactNode
}

interface ActionSheetHeaderProps {
  className?: string
  children: React.ReactNode
}

interface ActionSheetTitleProps {
  className?: string
  children: React.ReactNode
}

interface ActionSheetItemProps {
  className?: string
  children: React.ReactNode
  onPress?: () => void
  variant?: "default" | "destructive"
}

const { height: screenHeight } = Dimensions.get("window")

const ActionSheet = ({ open, onOpenChange, children }: ActionSheetProps) => {
  const [modalVisible, setModalVisible] = React.useState(false)
  const [isFullHeight, setIsFullHeight] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setModalVisible(true)
    } else {
      // Delay hiding modal until animation completes
      const timer = setTimeout(() => setModalVisible(false), 350)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleBackdropPress = React.useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const handleRequestClose = React.useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const toggleHeight = React.useCallback(() => {
    setIsFullHeight(prev => !prev)
  }, [])

  const maxHeight = isFullHeight ? screenHeight * 0.95 : screenHeight * 0.6

  return (
    <Modal 
      visible={modalVisible} 
      transparent 
      animationType="none" 
      onRequestClose={handleRequestClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Backdrop with fade animation */}
        <MotiView
          style={styles.backdrop}
          from={{
            opacity: 0,
          }}
          animate={{
            opacity: open ? 1 : 0,
          }}
          transition={{
            type: 'timing',
            duration: open ? 300 : 250,
            easing: open ? Easing.out(Easing.quad) : Easing.in(Easing.quad),
          }}
        >
          <Pressable style={StyleSheet.absoluteFillObject} onPress={handleBackdropPress} />
        </MotiView>

        {/* Sheet with slide animation */}
        <MotiView
          style={[styles.sheet, { maxHeight }]}
          from={{
            translateY: screenHeight,
          }}
          animate={{
            translateY: open ? 0 : screenHeight,
            maxHeight: maxHeight,
          }}
          transition={{
            type: 'timing',
            duration: open ? 400 : 300,
            easing: open 
              ? Easing.bezier(0.25, 0.46, 0.45, 0.94)
              : Easing.bezier(0.55, 0.06, 0.68, 0.19),
          }}
        >
          <ActionSheetContext.Provider value={{ toggleHeight, isFullHeight }}>
            {children}
          </ActionSheetContext.Provider>
        </MotiView>
      </View>
    </Modal>
  )
}

const ActionSheetContent = ({ children }: ActionSheetContentProps) => {
  return <View style={styles.content}>{children}</View>
}

const ActionSheetHeader = ({ children }: ActionSheetHeaderProps) => {
  return (
    <View style={styles.header}>
      {children}
    </View>
  )
}

const ActionSheetTitle = ({ children }: ActionSheetTitleProps) => {
  return <Text style={styles.title}>{children}</Text>
}

const ActionSheetItem = ({ children, onPress, variant = "default" }: ActionSheetItemProps) => {
  return (
    <TouchableOpacity
      style={[styles.item, variant === "destructive" && styles.destructiveItem]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text style={[styles.itemText, variant === "destructive" && styles.destructiveText]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}

const ActionSheetExpand = () => {
  const { toggleHeight, isFullHeight } = useActionSheet()

  return (
    <TouchableOpacity 
 
      onPress={toggleHeight}
      activeOpacity={0.7}
    >
      <RemixIcon 
        name={isFullHeight ? "collapse-diagonal-line" : "expand-diagonal-line"} 
        size={20} 
        color="#000"
      />
    </TouchableOpacity>
  )
}

const ActionSheetClose = ({ onClose }: { onClose: () => void }) => {
  return (
    <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
      <RemixIcon name="close-line" size={26} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
  },
  destructiveItem: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  itemText: {
    fontSize: 16,
    color: "#000",
  },
  destructiveText: {
    color: "#ef4444",
  },
  closeButton: {
    padding: 8,
    borderRadius: 6,
  },
  heightToggleButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    marginLeft: 8,
  },
})

export { ActionSheet, ActionSheetClose, ActionSheetContent, ActionSheetExpand, ActionSheetHeader, ActionSheetItem, ActionSheetTitle }

