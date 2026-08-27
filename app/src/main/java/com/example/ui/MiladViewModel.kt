package com.example.ui

import android.app.Application
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.AppDatabase
import com.example.data.model.AppLanguage
import com.example.data.model.DeliveryFrequency
import com.example.data.model.DeliveryServiceType
import com.example.data.model.WaterOrder
import com.example.data.model.WaterProductType
import com.example.data.repository.WaterRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class AppSection {
    HOME,
    PRODUCTS,
    SERVICES,
    BULK_EVENT,
    QUALITY,
    ABOUT,
    ORDER_HOW,
    CONTACT,
    MY_ORDERS
}

data class OrderFormState(
    val isOpen: Boolean = false,
    val customerName: String = "",
    val phone: String = "",
    val area: String = "মিরবক্সটুলা (Mirboxtula)",
    val address: String = "",
    val productType: WaterProductType = WaterProductType.JAR_20L,
    val jar20LQty: Int = 2,
    val bottle5LQty: Int = 0,
    val serviceType: DeliveryServiceType = DeliveryServiceType.HOME_DELIVERY,
    val frequency: DeliveryFrequency = DeliveryFrequency.ONE_TIME,
    val notes: String = "",
    val isSubmitting: Boolean = false,
    val submittedSuccess: Boolean = false,
    val lastSubmittedOrderId: Long? = null
)

class MiladViewModel(application: Application) : AndroidViewModel(application) {

    private val db = AppDatabase.getInstance(application)
    val repository = WaterRepository(db.orderDao())

    private val _language = MutableStateFlow(AppLanguage.BN)
    val language: StateFlow<AppLanguage> = _language.asStateFlow()

    private val _currentSection = MutableStateFlow(AppSection.HOME)
    val currentSection: StateFlow<AppSection> = _currentSection.asStateFlow()

    private val _orderFormState = MutableStateFlow(OrderFormState())
    val orderFormState: StateFlow<OrderFormState> = _orderFormState.asStateFlow()

    private val _isOrderHistoryOpen = MutableStateFlow(false)
    val isOrderHistoryOpen: StateFlow<Boolean> = _isOrderHistoryOpen.asStateFlow()

    val ordersList: StateFlow<List<WaterOrder>> = repository.allOrders
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun toggleLanguage() {
        _language.value = if (_language.value == AppLanguage.BN) AppLanguage.EN else AppLanguage.BN
    }

    fun setLanguage(lang: AppLanguage) {
        _language.value = lang
    }

    fun setCurrentSection(section: AppSection) {
        _currentSection.value = section
    }

    fun openOrderHistory(open: Boolean) {
        _isOrderHistoryOpen.value = open
    }

    fun openOrderSheet(
        productType: WaterProductType = WaterProductType.JAR_20L,
        serviceType: DeliveryServiceType = DeliveryServiceType.HOME_DELIVERY,
        initialJar20Qty: Int = 1,
        initialBottle5Qty: Int = 0
    ) {
        _orderFormState.value = OrderFormState(
            isOpen = true,
            productType = productType,
            serviceType = serviceType,
            jar20LQty = if (productType == WaterProductType.BOTTLE_5L) 0 else if (initialJar20Qty > 0) initialJar20Qty else 1,
            bottle5LQty = if (productType == WaterProductType.JAR_20L) 0 else if (initialBottle5Qty > 0) initialBottle5Qty else 1
        )
    }

    fun closeOrderSheet() {
        _orderFormState.value = _orderFormState.value.copy(isOpen = false, submittedSuccess = false)
    }

    fun updateCustomerName(name: String) {
        _orderFormState.value = _orderFormState.value.copy(customerName = name)
    }

    fun updatePhone(phone: String) {
        _orderFormState.value = _orderFormState.value.copy(phone = phone)
    }

    fun updateArea(area: String) {
        _orderFormState.value = _orderFormState.value.copy(area = area)
    }

    fun updateAddress(address: String) {
        _orderFormState.value = _orderFormState.value.copy(address = address)
    }

    fun updateProductType(type: WaterProductType) {
        val current = _orderFormState.value
        val (jarQty, bottleQty) = when (type) {
            WaterProductType.JAR_20L -> Pair(if (current.jar20LQty > 0) current.jar20LQty else 1, 0)
            WaterProductType.BOTTLE_5L -> Pair(0, if (current.bottle5LQty > 0) current.bottle5LQty else 1)
            WaterProductType.BOTH -> Pair(
                if (current.jar20LQty > 0) current.jar20LQty else 1,
                if (current.bottle5LQty > 0) current.bottle5LQty else 1
            )
        }
        _orderFormState.value = current.copy(
            productType = type,
            jar20LQty = jarQty,
            bottle5LQty = bottleQty
        )
    }

    fun updateJar20Qty(qty: Int) {
        val safeQty = qty.coerceAtLeast(0)
        _orderFormState.value = _orderFormState.value.copy(jar20LQty = safeQty)
    }

    fun updateBottle5Qty(qty: Int) {
        val safeQty = qty.coerceAtLeast(0)
        _orderFormState.value = _orderFormState.value.copy(bottle5LQty = safeQty)
    }

    fun updateServiceType(serviceType: DeliveryServiceType) {
        _orderFormState.value = _orderFormState.value.copy(serviceType = serviceType)
    }

    fun updateFrequency(frequency: DeliveryFrequency) {
        _orderFormState.value = _orderFormState.value.copy(frequency = frequency)
    }

    fun updateNotes(notes: String) {
        _orderFormState.value = _orderFormState.value.copy(notes = notes)
    }

    fun submitOrder(context: Context, launchWhatsAppOrSms: Boolean = true) {
        val state = _orderFormState.value
        if (state.phone.trim().isEmpty()) {
            Toast.makeText(
                context,
                if (_language.value == AppLanguage.BN) "দয়া করে আপনার মোবাইল নম্বর দিন" else "Please enter your phone number",
                Toast.LENGTH_SHORT
            ).show()
            return
        }

        if (state.jar20LQty == 0 && state.bottle5LQty == 0) {
            Toast.makeText(
                context,
                if (_language.value == AppLanguage.BN) "দয়া করে পানির পরিমাণ নির্বাচন করুন" else "Please select water quantity",
                Toast.LENGTH_SHORT
            ).show()
            return
        }

        viewModelScope.launch {
            _orderFormState.value = _orderFormState.value.copy(isSubmitting = true)

            val order = WaterOrder(
                customerName = state.customerName.ifBlank { "Customer" },
                phone = state.phone,
                address = state.address,
                area = state.area,
                productType = state.productType,
                jar20LQuantity = state.jar20LQty,
                bottle5LQuantity = state.bottle5LQty,
                serviceType = state.serviceType,
                frequency = state.frequency,
                deliveryDate = "Today / Earliest",
                notes = state.notes
            )

            val newId = repository.saveOrder(order)

            _orderFormState.value = _orderFormState.value.copy(
                isSubmitting = false,
                submittedSuccess = true,
                lastSubmittedOrderId = newId
            )

            Toast.makeText(
                context,
                if (_language.value == AppLanguage.BN) "অর্ডার সফলভাবে গ্রহণ করা হয়েছে! কল/হোয়াটসঅ্যাপে যোগাযোগ করা হচ্ছে..." else "Order registered successfully! Connecting...",
                Toast.LENGTH_LONG
            ).show()

            if (launchWhatsAppOrSms) {
                sendOrderViaWhatsApp(context, order)
            }
        }
    }

    fun dialCall(context: Context) {
        try {
            val intent = Intent(Intent.ACTION_DIAL).apply {
                data = Uri.parse("tel:${repository.phone}")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(context, "Call: ${repository.phone}", Toast.LENGTH_SHORT).show()
        }
    }

    fun sendEmail(context: Context, subject: String = "Water Supply Order - Milad Drinking Water") {
        try {
            val intent = Intent(Intent.ACTION_SENDTO).apply {
                data = Uri.parse("mailto:${repository.email}")
                putExtra(Intent.EXTRA_SUBJECT, subject)
                putExtra(Intent.EXTRA_TEXT, "Hello Milad Drinking Water team,\n\nI want to order drinking water for Sylhet location.\n\nPhone: \nAddress: \nQuantity: ")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(context, "Email: ${repository.email}", Toast.LENGTH_SHORT).show()
        }
    }

    fun openSylhetMap(context: Context) {
        try {
            // Mirboxtula, Sylhet
            val uri = Uri.parse("geo:0,0?q=Mirboxtula+Sylhet+Bangladesh+(Milad+Drinking+Water)")
            val mapIntent = Intent(Intent.ACTION_VIEW, uri).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(mapIntent)
        } catch (e: Exception) {
            Toast.makeText(context, repository.factoryAddressBn, Toast.LENGTH_SHORT).show()
        }
    }

    fun sendOrderViaWhatsApp(context: Context, order: WaterOrder) {
        try {
            val text = """
                *MILAD DRINKING WATER - ORDER REQUEST*
                -------------------------------------
                *Customer:* ${order.customerName}
                *Phone:* ${order.phone}
                *Area:* ${order.area}
                *Address:* ${order.address}
                *20 Litre Jar:* ${order.jar20LQuantity}
                *5 Litre Bottle:* ${order.bottle5LQuantity}
                *Service:* ${order.serviceType.name}
                *Frequency:* ${order.frequency.name}
                *Notes:* ${order.notes}
                -------------------------------------
                Order ID: #${order.id}
            """.trimIndent()

            val encoded = Uri.encode(text)
            val uri = Uri.parse("https://wa.me/8801711102448?text=$encoded")
            val intent = Intent(Intent.ACTION_VIEW, uri).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            dialCall(context)
        }
    }

    fun deleteOrder(orderId: Long) {
        viewModelScope.launch {
            repository.deleteOrder(orderId)
        }
    }
}
