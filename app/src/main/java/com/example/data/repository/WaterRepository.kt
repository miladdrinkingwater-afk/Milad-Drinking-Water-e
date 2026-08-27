package com.example.data.repository

import com.example.R
import com.example.data.local.OrderDao
import com.example.data.model.DeliveryServiceType
import com.example.data.model.ProductInfo
import com.example.data.model.QualityFeature
import com.example.data.model.ServiceInfo
import com.example.data.model.TrustItem
import com.example.data.model.WaterOrder
import com.example.data.model.WaterProductType
import kotlinx.coroutines.flow.Flow

class WaterRepository(private val orderDao: OrderDao) {

    // Brand Constants
    val brandNameBn = "মিলাদ ড্রিংকিং ওয়াটার"
    val brandNameEn = "Milad Drinking Water"
    val taglineBn = "বিশুদ্ধতার প্রতিশ্রুতি, প্রতিদিনের পানিতে"
    val taglineEn = "Pure Water. Trusted Every Day."
    val establishedYear = "2006"
    val ownerNameBn = "হাজী মিলাদ আহমদ"
    val ownerNameEn = "Haji Milad Ahmad"
    val factoryAddressBn = "মিরবক্সটুলা, সিলেট, বাংলাদেশ"
    val factoryAddressEn = "Mirboxtula, Sylhet, Bangladesh"
    val phone = "+8801711102448"
    val email = "miladdrinkingwater@gmail.com"
    val bstiCertification = "BSTI Approved"

    // Sylhet prominent delivery locations
    val sylhetDeliveryAreas = listOf(
        "মিরবক্সটুলা (Mirboxtula)",
        "জিন্দাবাজার (Zindabazar)",
        "আম্বরখানা (Amberkhana)",
        "চৌহাট্টা (Chouhatta)",
        "কুমারপাড়া (Kumarpara)",
        "শিবগঞ্জ (Shibgonj)",
        "উপশহর (Upashahar)",
        "মিরের ময়দান (Mirer Moydan)",
        "টিলাগড় (Tilagarh)",
        "পাঠানটুলা (Pathantula)",
        "মদিনা মার্কেট (Madina Market)",
        "লামাবাজার (Lamabazar)",
        "রিকাবীবাজার (Rikabibazar)",
        "কদমতলী (Kadamtali)",
        "শাহজালাল উপশহর (Shahjalal Upashahar)",
        "অন্যান্য এলাকা (Other Sylhet Area)"
    )

    // Strictly two products: 20L Jar and 5L Bottle
    val products = listOf(
        ProductInfo(
            id = "JAR_20L",
            nameBn = "২০ লিটার ড্রিংকিং ওয়াটার জার",
            nameEn = "20 Litre Drinking Water Jar",
            sizeBn = "২০ লিটার",
            sizeEn = "20 Litre",
            taglineBn = "বাসা ও অফিসের নিয়মিত পানির জন্য নির্ভরযোগ্য",
            taglineEn = "Reliable for daily home & office water supply",
            descBn = "বাসা ও অফিসের নিয়মিত পানির প্রয়োজনের জন্য নির্ভরযোগ্য ২০ লিটারের বিশুদ্ধ পানি। ডিসপেনসার ও রেগুলার ইউজের জন্য অত্যন্ত উপযোগী।",
            descEn = "Dependable 20 Litre purified drinking water for regular daily water needs at home, corporate offices, and commercial establishments.",
            idealForBn = "বাসাবাড়ি, কর্পোরেট অফিস, হাসপাতাল, শিক্ষাপ্রতিষ্ঠান ও নিয়মিত সরবরাহ",
            idealForEn = "Homes, Corporate Offices, Clinics, Educational Institutes & Regular Supply",
            highlightsBn = listOf(
                "হাইজিনিক সিলড ক্যাপ",
                "সহজে ডিসপেনসারে ব্যবহার উপযোগী",
                "বাসা ও অফিসে দ্রুত ডেলিভারি",
                "বিএসটিআই মানসম্মত"
            ),
            highlightsEn = listOf(
                "Hygienically Sealed Cap",
                "Compatible with Standard Dispensers",
                "Prompt Home & Office Delivery",
                "BSTI Quality Assured"
            ),
            drawableRes = R.drawable.img_water_jar_20l
        ),
        ProductInfo(
            id = "BOTTLE_5L",
            nameBn = "৫ লিটার ড্রিংকিং ওয়াটার বোতল",
            nameEn = "5 Litre Drinking Water Bottle",
            sizeBn = "৫ লিটার",
            sizeEn = "5 Litre",
            taglineBn = "ছোট আয়োজন ও সুবিধাজনক ব্যবহারের জন্য",
            taglineEn = "Convenient for small gatherings & portable use",
            descBn = "বাসা, অফিস ও ছোট আয়োজনের জন্য সুবিধাজনক ৫ লিটারের বিশুদ্ধ পানি। সহজে বহনযোগ্য হ্যান্ডেল ও প্রিমিয়াম বিশুদ্ধতার গ্যারান্টি।",
            descEn = "Convenient 5 Litre purified drinking water with sturdy handle, ideal for small gatherings, family dining, and instant portable needs.",
            idealForBn = "পারিবারিক ডাইনিং, মিটিং, ছোট পার্টি ও ভ্রাম্যমাণ ব্যবহারের জন্য",
            idealForEn = "Family Dining, Executive Meetings, Small Events & Flexible Use",
            highlightsBn = listOf(
                "সহজে বহনযোগ্য মজবুত হ্যান্ডেল",
                "টেবিল ও ডাইনিং উপযোগী সাইজ",
                "ছোট অনুষ্ঠানের জন্য পারফেক্ট",
                "বিএসটিআই অনুমোদিত"
            ),
            highlightsEn = listOf(
                "Sturdy Ergonomic Carry Handle",
                "Perfect for Dining & Meeting Tables",
                "Ideal for Small Events & Parties",
                "BSTI Approved Standard"
            ),
            drawableRes = R.drawable.img_water_bottle_5l
        )
    )

    // Core Services
    val services = listOf(
        ServiceInfo(
            id = DeliveryServiceType.HOME_DELIVERY,
            titleBn = "হোম ডেলিভারি (Home Delivery)",
            titleEn = "Home Delivery",
            subtitleBn = "আপনার বাসায় বিশুদ্ধ পানি",
            subtitleEn = "Pure water at your doorstep",
            descBn = "নিয়মিত বা প্রয়োজন অনুযায়ী বাসাবাড়িতে নির্ভরযোগ্য ও সময়মতো বিশুদ্ধ পানি সরবরাহ। আপনার পরিবারের নিরাপদ পানির প্রতিদিনের সঙ্গী।",
            descEn = "Regular or on-demand pure drinking water delivery directly to your home in Sylhet. The reliable daily partner for your family's health.",
            ctaBn = "অর্ডার করুন",
            ctaEn = "Order for Home",
            badgeBn = "দৈনিক ও সাপ্তাহিক",
            badgeEn = "Daily & Weekly"
        ),
        ServiceInfo(
            id = DeliveryServiceType.OFFICE_DELIVERY,
            titleBn = "অফিস সাপ্লাই (Office Delivery)",
            titleEn = "Office Delivery",
            subtitleBn = "অফিসের জন্য নির্ভরযোগ্য পানি সরবরাহ",
            subtitleEn = "Dependable water supply for corporate workplaces",
            descBn = "অফিস, বাণিজ্যিক প্রতিষ্ঠান, ব্যাংক ও কর্পোরেট কর্মস্থলের নিয়মিত পানির চাহিদা পূরণ। ডেডিকেটেড রিকারিং ডেলিভারি সুবিধা।",
            descEn = "Fulfilling regular hydration needs of offices, corporate workplaces, banks, and institutions with scheduled recurring deliveries.",
            ctaBn = "অফিস সাপ্লাই নিন",
            ctaEn = "Get Office Supply",
            badgeBn = "কর্পোরেট প্যাকেজ",
            badgeEn = "Corporate Package"
        ),
        ServiceInfo(
            id = DeliveryServiceType.EVENT_SUPPLY,
            titleBn = "ইভেন্ট সাপ্লাই (Event & Bulk Supply)",
            titleEn = "Event & Bulk Supply",
            subtitleBn = "আপনার বিশেষ আয়োজনের জন্য",
            subtitleEn = "For all your special events and large occasions",
            descBn = "মিলাদ মাহফিল, বিয়ে, সভা, সেমিনার, সামাজিক অনুষ্ঠান, কর্পোরেট ইভেন্ট বা বড় আয়োজনের জন্য প্রয়োজন অনুযায়ী ৫ ও ২০ লিটার বাল্ক পানি সরবরাহ।",
            descEn = "Comprehensive bulk water supply for Milad Mehfil, Weddings, Corporate Seminars, Conferences, and Social Ceremonies with flexible jar and bottle supplies.",
            ctaBn = "Event Supply নিন",
            ctaEn = "Book Event Supply",
            badgeBn = "বাল্ক স্পেশাল",
            badgeEn = "Bulk Special"
        )
    )

    // Trust items
    val trustItems = listOf(
        TrustItem(
            titleBn = "২০০৬ থেকে",
            titleEn = "Since 2006",
            subtitleBn = "বিশ্বস্ততার পথচলা",
            subtitleEn = "Two Decades of Trust"
        ),
        TrustItem(
            titleBn = "BSTI Approved",
            titleEn = "BSTI Approved",
            subtitleBn = "মানসম্মত পানির নিশ্চয়তা",
            subtitleEn = "Certified Purity & Standard"
        ),
        TrustItem(
            titleBn = "Home Delivery",
            titleEn = "Home Delivery",
            subtitleBn = "বাসায় পৌঁছে দিই",
            subtitleEn = "Doorstep Delivery in Sylhet"
        ),
        TrustItem(
            titleBn = "Office & Events",
            titleEn = "Office & Events",
            subtitleBn = "প্রয়োজন অনুযায়ী সরবরাহ",
            subtitleEn = "Custom Bulk Supply"
        )
    )

    // Why Choose Features (6 features)
    val whyChooseFeatures = listOf(
        TrustItem("Trusted Since 2006", "Trusted Since 2006", "২০০৬ সাল থেকে সিলেটের মানুষের বিশ্বস্ত সেবায় নিয়োজিত।", "Serving Sylhet residents and businesses with honor since 2006."),
        TrustItem("BSTI Approved", "BSTI Approved", "জাতীয় মান নিয়ন্ত্রণ সংস্থা বিএসটিআই কর্তৃক অনুমোদিত নিরাপদ পানি।", "Certified and strictly compliant with national BSTI drinking water standards."),
        TrustItem("Pure Drinking Water", "Pure Drinking Water", "প্রতিটি ফোঁটায় সর্বোচ্চ বিশুদ্ধতা ও স্বাস্থ্যসম্মত পরিবেশ নিশ্চিতকরণ।", "Utmost focus on hygienic packaging and pristine drinking water purity."),
        TrustItem("Home Delivery", "Home Delivery", "সিলেট শহরের বাসাবাড়িতে দ্রুত ও নির্ভরযোগ্য ডেলিভারি সার্ভিস।", "Prompt and scheduled water jar & bottle delivery right to your door."),
        TrustItem("Office Supply", "Office Supply", "ব্যবসা প্রতিষ্ঠান ও কর্পোরেট অফিসে নিরবচ্ছিন্ন মাসিক সাপ্লাই।", "Uninterrupted regular supply contracts for corporate workplaces."),
        TrustItem("Event Supply", "Event Supply", "বিয়ে, মিলাদ, সেমিনার বা বিশেষ আয়োজনে বাল্ক কোয়ান্টিটি সরবরাহ।", "Flexible bulk water capacity for large ceremonies, gatherings and festivals.")
    )

    // Database Orders Flow
    val allOrders: Flow<List<WaterOrder>> = orderDao.getAllOrders()

    suspend fun saveOrder(order: WaterOrder): Long {
        return orderDao.insertOrder(order)
    }

    suspend fun deleteOrder(orderId: Long) {
        orderDao.deleteOrder(orderId)
    }
}
