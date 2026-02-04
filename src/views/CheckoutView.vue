<template>
  <div class="checkout-view">
    <div class="container">
      <div class="checkout-header">
        <h1>确认订单</h1>
        <div class="checkout-steps">
          <div class="step active">1. 购物车</div>
          <div class="step active">2. 信息填写</div>
          <div class="step">3. 支付</div>
          <div class="step">4. 完成</div>
        </div>
      </div>

      <div class="checkout-content">
        <!-- 左侧：表单 -->
        <div class="checkout-form">
          <form @submit.prevent="submitOrder">
            <!-- 配送信息 -->
            <div class="form-section">
              <h2>配送信息</h2>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="name">收货人姓名 *</label>
                  <input
                    id="name"
                    v-model="deliveryInfo.name"
                    type="text"
                    required
                    placeholder="请输入收货人姓名"
                  />
                </div>
                
                <div class="form-group">
                  <label for="phone">联系电话 *</label>
                  <input
                    id="phone"
                    v-model="deliveryInfo.phone"
                    type="tel"
                    required
                    placeholder="请输入联系电话"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="address">配送地址 *</label>
                <input
                  id="address"
                  v-model="deliveryInfo.address"
                  type="text"
                  required
                  placeholder="请输入详细地址"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="apartment">门牌号</label>
                  <input
                    id="apartment"
                    v-model="deliveryInfo.apartment"
                    type="text"
                    placeholder="如：A栋201室"
                  />
                </div>
                
                <div class="form-group">
                  <label for="postalCode">邮政编码</label>
                  <input
                    id="postalCode"
                    v-model="deliveryInfo.postalCode"
                    type="text"
                    placeholder="邮政编码"
                  />
                </div>
              </div>
            </div>

            <!-- 配送时间 -->
            <div class="form-section">
              <h2>配送时间</h2>
              <div class="delivery-options">
                <label
                  v-for="option in deliveryOptions"
                  :key="option.value"
                  :class="['delivery-option', { active: deliveryInfo.deliveryTime === option.value }]"
                >
                  <input
                    type="radio"
                    v-model="deliveryInfo.deliveryTime"
                    :value="option.value"
                    class="radio-input"
                  />
                  <div class="option-content">
                    <span class="option-title">{{ option.title }}</span>
                    <span class="option-time">{{ option.time }}</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- 支付方式 -->
            <div class="form-section">
              <h2>支付方式</h2>
              <div class="payment-options">
                <label
                  v-for="method in paymentMethods"
                  :key="method.id"
                  :class="['payment-method', { active: deliveryInfo.paymentMethod === method.id }]"
                >
                  <input
                    type="radio"
                    v-model="deliveryInfo.paymentMethod"
                    :value="method.id"
                    class="radio-input"
                  />
                  <div class="method-content">
                    <span class="method-icon">{{ method.icon }}</span>
                    <span class="method-name">{{ method.name }}</span>
                    <span v-if="method.description" class="method-description">{{ method.description }}</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- 备注 -->
            <div class="form-section">
              <h2>订单备注</h2>
              <div class="form-group">
                <textarea
                  v-model="deliveryInfo.notes"
                  placeholder="如有特殊要求，请在此说明（如：不要辣、不要葱花等）"
                  rows="3"
                  class="notes-input"
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="goBack" class="back-btn">
                ← 返回购物车
              </button>
              <button type="submit" class="submit-btn" :disabled="!canSubmit">
                确认订单 → 
              </button>
            </div>
          </form>
        </div>

        <!-- 右侧：订单汇总 -->
        <div class="order-summary">
          <h2>订单详情</h2>
          
          <div class="order-items">
            <div v-for="item in cartItems" :key="item.id" class="order-item">
              <div class="item-info">
                <span class="item-name">{{ item.name }} × {{ item.quantity }}</span>
                <span class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
              <div v-if="item.specialInstructions" class="item-notes">
                {{ item.specialInstructions }}
              </div>
            </div>
          </div>

          <div class="summary-details">
            <div class="summary-row">
              <span>商品小计</span>
              <span>¥{{ cartTotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>配送费</span>
              <span v-if="deliveryFee > 0">¥{{ deliveryFee.toFixed(2) }}</span>
              <span v-else class="free">免费</span>
            </div>
            <div v-if="discount > 0" class="summary-row discount">
              <span>优惠减免</span>
              <span>-¥{{ discount.toFixed(2) }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
              <span>订单总计</span>
              <span>¥{{ orderTotal.toFixed(2) }}</span>
            </div>
          </div>

          <div class="delivery-estimate">
            <h3>预计送达</h3>
            <p class="estimated-time">{{ estimatedDeliveryTime }}</p>
            <p class="address-preview" v-if="deliveryInfo.address">
              送至：{{ deliveryInfo.address }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuStore } from '@/stores/menuStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const menuStore = useMenuStore()
const { cartItems, cartTotal } = storeToRefs(menuStore)
const { clearCart } = menuStore

// 配送选项
const deliveryOptions = [
  { value: 'asap', title: '尽快送达', time: '约30分钟' },
  { value: 'specific', title: '指定时间', time: '今天 18:00-19:00' },
  { value: 'later', title: '稍后送达', time: '今天 20:00-21:00' }
]

// 支付方式
const paymentMethods = [
  { id: 'alipay', name: '支付宝', icon: '💳', description: '推荐使用' },
  { id: 'wechat', name: '微信支付', icon: '💰' },
  { id: 'cash', name: '货到付款', icon: '💵', description: '现金支付' },
  { id: 'card', name: '在线支付', icon: '💳' }
]

// 配送信息
const deliveryInfo = ref({
  name: '',
  phone: '',
  address: '',
  apartment: '',
  postalCode: '',
  deliveryTime: 'asap',
  paymentMethod: 'alipay',
  notes: ''
})

// 计算属性
const deliveryFee = computed(() => cartTotal.value > 50 ? 0 : 5)
const discount = computed(() => cartTotal.value > 100 ? 10 : 0)
const orderTotal = computed(() => {
  return Math.max(0, cartTotal.value + deliveryFee.value - discount.value)
})

const estimatedDeliveryTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 30)
  return now.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
})

const canSubmit = computed(() => {
  return (
    deliveryInfo.value.name.trim() &&
    deliveryInfo.value.phone.trim() &&
    deliveryInfo.value.address.trim() &&
    cartItems.value.length > 0
  )
})

// 生命周期
onMounted(() => {
  if (cartItems.value.length === 0) {
    router.push('/cart')
  }
})

// 方法
const goBack = () => {
  router.push('/cart')
}

const submitOrder = async () => {
  if (!canSubmit.value) return

  try {
    // 这里应该调用实际的订单API
    const orderData = {
      ...deliveryInfo.value,
      items: cartItems.value,
      subtotal: cartTotal.value,
      deliveryFee: deliveryFee.value,
      discount: discount.value,
      total: orderTotal.value,
      orderTime: new Date().toISOString(),
      orderId: 'ORD' + Date.now().toString().slice(-8)
    }

    // 保存订单到本地存储
    const orders = JSON.parse(localStorage.getItem('foodOrders') || '[]')
    orders.unshift(orderData)
    localStorage.setItem('foodOrders', JSON.stringify(orders))

    // 清空购物车
    clearCart()

    // 跳转到订单确认页面
    router.push({
      path: '/orders',
      query: { 
        orderId: orderData.orderId,
        success: 'true' 
      }
    })

  } catch (error) {
    console.error('下单失败:', error)
    alert('下单失败，请稍后重试')
  }
}
</script>

<style scoped>
.checkout-view {
  padding: 2rem 0 4rem;
  min-height: 100vh;
  background: #f8f9fa;
}

.checkout-header {
  text-align: center;
  margin-bottom: 3rem;
}

.checkout-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
}

.checkout-steps {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.step {
  padding: 0.5rem 1.5rem;
  background: #e0e0e0;
  border-radius: 20px;
  color: #666;
  font-weight: 500;
  position: relative;
}

.step.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.step:not(:last-child)::after {
  content: '→';
  position: absolute;
  right: -1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  align-items: start;
}

.checkout-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section h2 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group label::after {
  content: '*';
  color: #ff4757;
  margin-left: 0.25rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.notes-input {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.delivery-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.delivery-option {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.delivery-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.delivery-option.active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.radio-input {
  display: none;
}

.option-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.option-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.option-time {
  font-size: 0.9rem;
  color: #666;
}

.payment-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.payment-method.active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.method-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.method-icon {
  font-size: 1.5rem;
}

.method-name {
  font-weight: 500;
  color: #333;
  flex: 1;
}

.method-description {
  font-size: 0.85rem;
  color: #27ae60;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.back-btn,
.submit-btn {
  flex: 1;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.back-btn {
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e0e0e0;
}

.back-btn:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.order-summary {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  position: sticky;
  top: 2rem;
}

.order-summary h2 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.order-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  padding-right: 0.5rem;
}

.order-items::-webkit-scrollbar {
  width: 6px;
}

.order-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.order-items::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.order-item {
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.item-name {
  font-weight: 500;
  color: #333;
}

.item-price {
  font-weight: 600;
  color: #667eea;
}

.item-notes {
  font-size: 0.85rem;
  color: #e67e22;
  background: #fff8e1;
  padding: 0.5rem;
  border-radius: 6px;
  border-left: 3px solid #e67e22;
}

.summary-details {
  margin-bottom: 2rem;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #666;
  font-size: 0.95rem;
}

.summary-row.discount {
  color: #27ae60;
}

.summary-row.total {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.summary-divider {
  height: 1px;
  background: #eee;
  margin: 1rem 0;
}

.delivery-estimate {
  background: #f8f9ff;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.delivery-estimate h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.estimated-time {
  font-size: 1.5rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.address-preview {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
  word-break: break-all;
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
  
  .order-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .checkout-steps {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .step:not(:last-child)::after {
    content: '↓';
    right: 50%;
    bottom: -1.5rem;
    top: auto;
    transform: translateX(50%);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .payment-options {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>