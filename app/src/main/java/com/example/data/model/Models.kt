package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class AppLanguage {
    BN, EN
}

enum class WaterProductType {
    JAR_20L,
    BOTTLE_5L,
    BOTH
}

enum class DeliveryServiceType {
    HOME_DELIVERY,
    OFFICE_DELIVERY,
    EVENT_SUPPLY,
    REGULAR_SUPPLY
}

enum class DeliveryFrequency {
    ONE_TIME,
    DAILY,
    ALTERNATE_DAYS,
    WEEKLY
}

enum class OrderStatus {
    RECEIVED,
    CONFIRMED,
    DISPATCHED,
    DELIVERED
}

@Entity(tableName = "water_orders")
data class WaterOrder(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val customerName: String,
    val phone: String,
    val address: String,
    val area: String,
    val productType: WaterProductType,
    val jar20LQuantity: Int = 0,
    val bottle5LQuantity: Int = 0,
    val serviceType: DeliveryServiceType,
    val frequency: DeliveryFrequency = DeliveryFrequency.ONE_TIME,
    val deliveryDate: String,
    val notes: String = "",
    val timestamp: Long = System.currentTimeMillis(),
    val status: OrderStatus = OrderStatus.RECEIVED
)

data class ProductInfo(
    val id: String,
    val nameBn: String,
    val nameEn: String,
    val sizeBn: String,
    val sizeEn: String,
    val taglineBn: String,
    val taglineEn: String,
    val descBn: String,
    val descEn: String,
    val idealForBn: String,
    val idealForEn: String,
    val highlightsBn: List<String>,
    val highlightsEn: List<String>,
    val drawableRes: Int
)

data class ServiceInfo(
    val id: DeliveryServiceType,
    val titleBn: String,
    val titleEn: String,
    val subtitleBn: String,
    val subtitleEn: String,
    val descBn: String,
    val descEn: String,
    val ctaBn: String,
    val ctaEn: String,
    val badgeBn: String,
    val badgeEn: String
)

data class TrustItem(
    val titleBn: String,
    val titleEn: String,
    val subtitleBn: String,
    val subtitleEn: String
)

data class QualityFeature(
    val titleBn: String,
    val titleEn: String,
    val descBn: String,
    val descEn: String
)

data class ContactMessage(
    val name: String,
    val phone: String,
    val service: String,
    val message: String,
    val timestamp: Long = System.currentTimeMillis()
)
