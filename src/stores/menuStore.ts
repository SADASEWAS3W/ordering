import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: '中式' | '西式' | '饮品' | '甜点'
  image: string
  available: boolean
  popular: boolean
  calories?: number
  prepTime: number // 准备时间（分钟）
}

export interface CartItem extends MenuItem {
  quantity: number
  specialInstructions?: string
}

export const useMenuStore = defineStore('menu', () => {
  // 状态
  const menuItems = ref<MenuItem[]>([
    {
      id: 1,
      name: '宫保鸡丁',
      description: '经典川菜，鸡丁鲜嫩，花生香脆',
      price: 38,
      category: '中式',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
      available: true,
      popular: true,
      calories: 320,
      prepTime: 15
    },
    {
      id: 2,
      name: '麻辣香锅',
      description: '多种食材炒制，麻辣鲜香',
      price: 68,
      category: '中式',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
      available: true,
      popular: true,
      calories: 450,
      prepTime: 20
    },
    {
      id: 3,
      name: '牛排套餐',
      description: '澳洲进口牛排，搭配时蔬',
      price: 128,
      category: '西式',
      image: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w-400',
      available: true,
      popular: false,
      calories: 520,
      prepTime: 25
    },
    {
      id: 4,
      name: '意大利面',
      description: '传统番茄酱汁，配新鲜罗勒',
      price: 48,
      category: '西式',
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400',
      available: true,
      popular: true,
      calories: 380,
      prepTime: 18
    },
    {
      id: 5,
      name: '鲜榨橙汁',
      description: '新鲜橙子现榨，富含维生素C',
      price: 18,
      category: '饮品',
      image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
      available: true,
      popular: false,
      calories: 120,
      prepTime: 5
    },
    {
      id: 6,
      name: '抹茶拿铁',
      description: '日式抹茶粉，香浓牛奶',
      price: 28,
      category: '饮品',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
      available: true,
      popular: true,
      calories: 180,
      prepTime: 8
    },
    {
      id: 7,
      name: '提拉米苏',
      description: '意大利经典甜点，咖啡香气浓郁',
      price: 32,
      category: '甜点',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
      available: true,
      popular: true,
      calories: 280,
      prepTime: 10
    }
  ])

  const cartItems = ref<CartItem[]>([])
  const searchQuery = ref('')
  const selectedCategory = ref<string>('全部')

  // Getter/计算属性
  const categories = computed(() => {
    const cats = ['全部', ...new Set(menuItems.value.map(item => item.category))]
    return cats
  })

  const filteredMenu = computed(() => {
    return menuItems.value.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesCategory = selectedCategory.value === '全部' || 
                            item.category === selectedCategory.value
      return matchesSearch && matchesCategory && item.available
    })
  })

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  // Actions
  const addToCart = (item: MenuItem, quantity: number = 1, specialInstructions?: string) => {
    const existingItem = cartItems.value.find(cartItem => cartItem.id === item.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
      if (specialInstructions) {
        existingItem.specialInstructions = specialInstructions
      }
    } else {
      cartItems.value.push({
        ...item,
        quantity,
        specialInstructions
      })
    }
  }

  const removeFromCart = (itemId: number) => {
    const index = cartItems.value.findIndex(item => item.id === itemId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  }

  const updateCartItemQuantity = (itemId: number, quantity: number) => {
    const item = cartItems.value.find(item => item.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const clearCart = () => {
    cartItems.value = []
  }

  return {
    // 状态
    menuItems,
    cartItems,
    searchQuery,
    selectedCategory,
    
    // Getter
    categories,
    filteredMenu,
    cartTotal,
    cartCount,
    
    // Actions
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart
  }
})