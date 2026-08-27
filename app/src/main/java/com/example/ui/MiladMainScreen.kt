package com.example.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.example.data.model.AppLanguage
import com.example.data.model.DeliveryServiceType
import com.example.data.model.WaterProductType
import com.example.ui.components.AboutSection
import com.example.ui.components.ContactSection
import com.example.ui.components.EventBulkBanner
import com.example.ui.components.FloatingBottomBar
import com.example.ui.components.HeroSection
import com.example.ui.components.MiladFooter
import com.example.ui.components.MiladHeader
import com.example.ui.components.OrderBottomSheet
import com.example.ui.components.OrderHistorySheet
import com.example.ui.components.OrderProcessSection
import com.example.ui.components.ProductsSection
import com.example.ui.components.QualitySection
import com.example.ui.components.ServicesSection
import com.example.ui.components.TrustBar
import com.example.ui.components.WhyChooseUsSection
import kotlinx.coroutines.launch

@Composable
fun MiladMainScreen(
    viewModel: MiladViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val scrollState = rememberScrollState()

    val language by viewModel.language.collectAsState()
    val currentSection by viewModel.currentSection.collectAsState()
    val orderFormState by viewModel.orderFormState.collectAsState()
    val isOrderHistoryOpen by viewModel.isOrderHistoryOpen.collectAsState()
    val ordersList by viewModel.ordersList.collectAsState()

    val repository = viewModel.repository

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            MiladHeader(
                language = language,
                currentSection = currentSection,
                orderCount = ordersList.size,
                onLanguageToggle = { viewModel.toggleLanguage() },
                onSectionClick = { section ->
                    viewModel.setCurrentSection(section)
                    coroutineScope.launch {
                        // Smooth scroll based on approximated section position
                        val scrollTarget = when (section) {
                            AppSection.HOME -> 0
                            AppSection.PRODUCTS -> 750
                            AppSection.SERVICES -> 1950
                            AppSection.BULK_EVENT -> 2750
                            AppSection.QUALITY -> 3450
                            AppSection.ABOUT -> 4200
                            AppSection.ORDER_HOW -> 4900
                            AppSection.CONTACT -> 5500
                            AppSection.MY_ORDERS -> {
                                viewModel.openOrderHistory(true)
                                return@launch
                            }
                        }
                        scrollState.animateScrollTo(scrollTarget)
                    }
                },
                onCallClick = { viewModel.dialCall(context) },
                onOrderHistoryClick = { viewModel.openOrderHistory(true) }
            )
        },
        bottomBar = {
            FloatingBottomBar(
                language = language,
                onCallClick = { viewModel.dialCall(context) },
                onQuickOrderClick = { viewModel.openOrderSheet() }
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(scrollState)
            ) {
                // 1. Hero Section
                HeroSection(
                    language = language,
                    onOrderClick = { viewModel.openOrderSheet(WaterProductType.JAR_20L, DeliveryServiceType.HOME_DELIVERY) },
                    onAboutClick = {
                        viewModel.setCurrentSection(AppSection.ABOUT)
                        coroutineScope.launch { scrollState.animateScrollTo(4200) }
                    },
                    onCallClick = { viewModel.dialCall(context) }
                )

                // 2. Trust Pillars Bar (4 points)
                TrustBar(
                    language = language,
                    trustItems = repository.trustItems
                )

                // 3. Products Section (Strictly 20L & 5L)
                ProductsSection(
                    language = language,
                    products = repository.products,
                    onOrderProduct = { productType, qty ->
                        if (productType == WaterProductType.JAR_20L) {
                            viewModel.openOrderSheet(
                                productType = WaterProductType.JAR_20L,
                                initialJar20Qty = qty,
                                initialBottle5Qty = 0
                            )
                        } else {
                            viewModel.openOrderSheet(
                                productType = WaterProductType.BOTTLE_5L,
                                initialJar20Qty = 0,
                                initialBottle5Qty = qty
                            )
                        }
                    },
                    onCallClick = { viewModel.dialCall(context) }
                )

                // 4. Core Services (Home, Office, Event)
                ServicesSection(
                    language = language,
                    services = repository.services,
                    onSelectService = { serviceType ->
                        viewModel.openOrderSheet(
                            productType = WaterProductType.JAR_20L,
                            serviceType = serviceType
                        )
                    }
                )

                // 5. Special Event & Bulk Supply Banner
                EventBulkBanner(
                    language = language,
                    onEventOrderClick = {
                        viewModel.openOrderSheet(
                            productType = WaterProductType.BOTH,
                            serviceType = DeliveryServiceType.EVENT_SUPPLY,
                            initialJar20Qty = 10,
                            initialBottle5Qty = 20
                        )
                    },
                    onCallClick = { viewModel.dialCall(context) }
                )

                // 6. Quality & BSTI Standards Section
                QualitySection(
                    language = language
                )

                // 7. Why Choose Milad Drinking Water (6 features)
                WhyChooseUsSection(
                    language = language,
                    features = repository.whyChooseFeatures
                )

                // 8. About Section (Haji Milad Ahmad, Mirboxtula factory, Est. 2006)
                AboutSection(
                    language = language,
                    onLocationClick = { viewModel.openSylhetMap(context) }
                )

                // 9. Order Process (3 simple steps)
                OrderProcessSection(
                    language = language,
                    onCallClick = { viewModel.dialCall(context) },
                    onOnlineOrderClick = { viewModel.openOrderSheet() }
                )

                // 10. Contact Section
                ContactSection(
                    language = language,
                    onCallClick = { viewModel.dialCall(context) },
                    onEmailClick = { viewModel.sendEmail(context) },
                    onMapClick = { viewModel.openSylhetMap(context) },
                    onSendMessage = { name, phone, msg ->
                        viewModel.updateCustomerName(name)
                        viewModel.updatePhone(phone)
                        viewModel.updateNotes(msg)
                        viewModel.submitOrder(context)
                    }
                )

                // 11. Corporate Footer
                MiladFooter(
                    language = language,
                    onSectionClick = { section ->
                        viewModel.setCurrentSection(section)
                        coroutineScope.launch {
                            val scrollTarget = when (section) {
                                AppSection.HOME -> 0
                                AppSection.PRODUCTS -> 750
                                AppSection.SERVICES -> 1950
                                AppSection.BULK_EVENT -> 2750
                                AppSection.QUALITY -> 3450
                                AppSection.ABOUT -> 4200
                                AppSection.ORDER_HOW -> 4900
                                AppSection.CONTACT -> 5500
                                AppSection.MY_ORDERS -> 0
                            }
                            scrollState.animateScrollTo(scrollTarget)
                        }
                    },
                    onCallClick = { viewModel.dialCall(context) },
                    onEmailClick = { viewModel.sendEmail(context) },
                    onMapClick = { viewModel.openSylhetMap(context) }
                )
            }
        }
    }

    // Interactive Order Bottom Sheet
    OrderBottomSheet(
        formState = orderFormState,
        language = language,
        sylhetAreas = repository.sylhetDeliveryAreas,
        onCustomerNameChange = { viewModel.updateCustomerName(it) },
        onPhoneChange = { viewModel.updatePhone(it) },
        onAreaChange = { viewModel.updateArea(it) },
        onAddressChange = { viewModel.updateAddress(it) },
        onJar20QtyChange = { viewModel.updateJar20Qty(it) },
        onBottle5QtyChange = { viewModel.updateBottle5Qty(it) },
        onServiceTypeChange = { viewModel.updateServiceType(it) },
        onFrequencyChange = { viewModel.updateFrequency(it) },
        onNotesChange = { viewModel.updateNotes(it) },
        onSubmit = { viewModel.submitOrder(context) },
        onCallDirect = { viewModel.dialCall(context) },
        onDismiss = { viewModel.closeOrderSheet() }
    )

    // Order History / My Orders Sheet
    OrderHistorySheet(
        isOpen = isOrderHistoryOpen,
        language = language,
        orders = ordersList,
        onReorder = { order ->
            viewModel.openOrderHistory(false)
            viewModel.openOrderSheet(
                productType = order.productType,
                serviceType = order.serviceType,
                initialJar20Qty = order.jar20LQuantity,
                initialBottle5Qty = order.bottle5LQuantity
            )
            viewModel.updateCustomerName(order.customerName)
            viewModel.updatePhone(order.phone)
            viewModel.updateArea(order.area)
            viewModel.updateAddress(order.address)
        },
        onDeleteOrder = { orderId ->
            viewModel.deleteOrder(orderId)
        },
        onCallSupport = { viewModel.dialCall(context) },
        onDismiss = { viewModel.openOrderHistory(false) }
    )
}
