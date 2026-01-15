import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const festivalEmojis = {
  'diwali': '🪔',
  'christmas': '🎄',
  'eid-al-fitr': '🌙',
  'holi': '🎨',
  'chinese-new-year': '🧧',
  'thanksgiving': '🦃',
  'easter': '🐰',
  'navratri': '💃',
  'hanukkah': '🕎',
  'new-year': '🎆',
  'raksha-bandhan': '🎀',
  'valentines-day': '💝',
  'durga-puja': '🔱',
  'ganesh-chaturthi': '🐘',
  'onam': '🌸',
  'pongal': '🍚',
  'baisakhi': '🌾',
  'eid-al-adha': '🕋',
  'makar-sankranti': '🪁',
  'lohri': '🔥',
  'dussehra': '🏹',
  'karwa-chauth': '🌙',
  'janmashtami': '🦚',
  'chhath-puja': '☀️',
  'republic-day': '🇮🇳',
  'basant-panchami': '🌼',
  'mardi-gras': '🎭',
  'ram-navami': '🏹',
  'nowruz': '🌷',
  'ugadi': '🌿',
  'good-friday': '✝️',
  'buddha-purnima': '🧘',
  'rath-yatra': '🛕',
  'guru-purnima': '🙏',
  'independence-day-india': '🇮🇳',
  'mid-autumn-festival': '🥮',
  'halloween': '🎃',
  'bhai-dooj': '👫',
  'kwanzaa': '🕯️',
  'obon': '🏮',
  'songkran': '💦',
  'losar': '🏔️',
}

const festivalGradients = {
  'diwali': 'from-orange-400 via-yellow-500 to-red-500',
  'christmas': 'from-red-500 via-green-600 to-red-500',
  'eid-al-fitr': 'from-emerald-400 via-teal-500 to-cyan-500',
  'holi': 'from-pink-400 via-purple-500 to-indigo-500',
  'chinese-new-year': 'from-red-500 via-orange-500 to-yellow-500',
  'thanksgiving': 'from-orange-400 via-amber-500 to-yellow-600',
  'easter': 'from-pink-300 via-purple-400 to-indigo-400',
  'navratri': 'from-red-400 via-pink-500 to-purple-500',
  'hanukkah': 'from-blue-400 via-indigo-500 to-purple-500',
  'new-year': 'from-purple-500 via-pink-500 to-red-500',
  'raksha-bandhan': 'from-pink-400 via-rose-500 to-red-400',
  'valentines-day': 'from-red-400 via-pink-500 to-rose-500',
  'durga-puja': 'from-red-500 via-orange-500 to-yellow-500',
  'ganesh-chaturthi': 'from-orange-400 via-red-500 to-pink-500',
  'onam': 'from-yellow-400 via-orange-400 to-red-400',
  'pongal': 'from-yellow-500 via-orange-500 to-red-500',
  'baisakhi': 'from-orange-400 via-yellow-500 to-green-500',
  'eid-al-adha': 'from-emerald-500 via-teal-500 to-cyan-500',
  'makar-sankranti': 'from-orange-400 via-yellow-400 to-blue-400',
  'lohri': 'from-orange-500 via-red-500 to-yellow-500',
  'dussehra': 'from-red-500 via-orange-500 to-yellow-500',
  'karwa-chauth': 'from-red-400 via-pink-500 to-purple-500',
  'janmashtami': 'from-blue-500 via-purple-500 to-pink-500',
  'chhath-puja': 'from-orange-500 via-yellow-500 to-red-500',
  'republic-day': 'from-orange-500 via-white to-green-500',
  'basant-panchami': 'from-yellow-400 via-yellow-500 to-orange-400',
  'mardi-gras': 'from-purple-500 via-yellow-500 to-green-500',
  'ram-navami': 'from-orange-400 via-yellow-500 to-red-500',
  'nowruz': 'from-green-400 via-teal-500 to-blue-500',
  'ugadi': 'from-yellow-400 via-green-500 to-orange-400',
  'good-friday': 'from-gray-600 via-purple-800 to-gray-700',
  'buddha-purnima': 'from-yellow-400 via-orange-400 to-amber-500',
  'rath-yatra': 'from-yellow-500 via-red-500 to-blue-500',
  'guru-purnima': 'from-orange-400 via-yellow-500 to-amber-500',
  'independence-day-india': 'from-orange-500 via-white to-green-600',
  'mid-autumn-festival': 'from-red-500 via-orange-500 to-yellow-500',
  'halloween': 'from-orange-500 via-purple-600 to-black',
  'bhai-dooj': 'from-pink-400 via-purple-500 to-indigo-500',
  'kwanzaa': 'from-red-600 via-black to-green-600',
  'obon': 'from-red-400 via-orange-400 to-yellow-400',
  'songkran': 'from-blue-400 via-cyan-400 to-teal-400',
  'losar': 'from-red-500 via-yellow-500 to-blue-500',
}

// High-quality Unsplash images for each festival - relevant to traditions
const festivalImages = {
  // Diwali - Diyas, fireworks, lights, rangoli celebration
  'diwali': 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop&q=80',
  // Christmas - Santa, gifts, decorated tree, family celebration
  'christmas': 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&h=300&fit=crop&q=80',
  // Eid - Mosque, prayers, crescent moon, celebration
  'eid-al-fitr': 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?w=400&h=300&fit=crop&q=80',
  // Holi - People playing with colors, gulal, celebration
  'holi': 'https://images.unsplash.com/photo-1576098124070-9f8fbe7f7e86?w=400&h=300&fit=crop&q=80',
  // Chinese New Year - Red lanterns, dragon dance, decorations
  'chinese-new-year': 'https://images.unsplash.com/photo-1517315003714-a071486bd9ea?w=400&h=300&fit=crop&q=80',
  // Thanksgiving - Turkey dinner, family gathering, harvest
  'thanksgiving': 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400&h=300&fit=crop&q=80',
  // Easter - Easter eggs, bunny, spring flowers
  'easter': 'https://images.unsplash.com/photo-1457301353672-324d6d14f471?w=400&h=300&fit=crop&q=80',
  // Navratri - Garba dance, colorful dress, dandiya
  'navratri': 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=400&h=300&fit=crop&q=80',
  // Hanukkah - Menorah candles, dreidel, celebration
  'hanukkah': 'https://images.unsplash.com/photo-1545064193-a34a5dd4f31c?w=400&h=300&fit=crop&q=80',
  // New Year - Fireworks, midnight celebration, champagne
  'new-year': 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&h=300&fit=crop&q=80',
  // Raksha Bandhan - Rakhi thread, brother-sister bond
  'raksha-bandhan': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop&q=80',
  // Valentine's Day - Red roses, hearts, love
  'valentines-day': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=300&fit=crop&q=80',
  // Durga Puja - Durga idol, pandal, worship
  'durga-puja': 'https://images.unsplash.com/photo-1602442787305-decbd65be507?w=400&h=300&fit=crop&q=80',
  // Ganesh Chaturthi - Ganesha idol, modak, celebration
  'ganesh-chaturthi': 'https://images.unsplash.com/photo-1567591370504-80a5854fc2a4?w=400&h=300&fit=crop&q=80',
  // Onam - Pookalam flower rangoli, sadya feast, boat race
  'onam': 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=400&h=300&fit=crop&q=80',
  // Pongal - Pot boiling over, harvest, cattle
  'pongal': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=300&fit=crop&q=80',
  // Baisakhi - Bhangra dance, wheat harvest, celebration
  'baisakhi': 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=400&h=300&fit=crop&q=80',
  // Eid al-Adha - Mosque, sacrifice, family gathering
  'eid-al-adha': 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?w=400&h=300&fit=crop&q=80',
  // Makar Sankranti - Colorful kites flying in sky
  'makar-sankranti': 'https://images.unsplash.com/photo-1528142274942-6dce8c2e7d5f?w=400&h=300&fit=crop&q=80',
  // Lohri - Bonfire, people celebrating around fire
  'lohri': 'https://images.unsplash.com/photo-1475552113915-6fcb52652ba2?w=400&h=300&fit=crop&q=80',
  // Dussehra - Ravana effigy, bow and arrow, victory
  'dussehra': 'https://images.unsplash.com/photo-1602442787305-decbd65be507?w=400&h=300&fit=crop&q=80',
  // Karwa Chauth - Moon, married woman, sieve ritual
  'karwa-chauth': 'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=400&h=300&fit=crop&q=80',
  // Janmashtami - Krishna idol, flute, dahi handi
  'janmashtami': 'https://images.unsplash.com/photo-1633544847558-e3e6e5e7e0f7?w=400&h=300&fit=crop&q=80',
  // Chhath Puja - Sunrise/sunset worship, water offering
  'chhath-puja': 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&h=300&fit=crop&q=80',
  // Republic Day - Indian flag, parade, tricolor
  'republic-day': 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&h=300&fit=crop&q=80',
  // Basant Panchami - Yellow flowers, Saraswati worship
  'basant-panchami': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop&q=80',
  // Mardi Gras - Colorful masks, parade, beads
  'mardi-gras': 'https://images.unsplash.com/photo-1551801841-ecad875a5142?w=400&h=300&fit=crop&q=80',
  // Ram Navami - Temple, Ram idol, worship
  'ram-navami': 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=400&h=300&fit=crop&q=80',
  // Nowruz - Haft-sin table, spring flowers, celebration
  'nowruz': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop&q=80',
  // Ugadi - Mango leaves, new year celebration
  'ugadi': 'https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=400&h=300&fit=crop&q=80',
  // Good Friday - Cross, church, solemn reflection
  'good-friday': 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=300&fit=crop&q=80',
  // Buddha Purnima - Buddha statue, meditation, temple
  'buddha-purnima': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&q=80',
  // Rath Yatra - Chariot, Jagannath temple, procession
  'rath-yatra': 'https://images.unsplash.com/photo-1545468800-85cc9bc6ecf7?w=400&h=300&fit=crop&q=80',
  // Guru Purnima - Teacher, spiritual, gratitude
  'guru-purnima': 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop&q=80',
  // Independence Day - Indian flag, freedom, tricolor
  'independence-day-india': 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&h=300&fit=crop&q=80',
  // Mid-Autumn Festival - Mooncakes, lanterns, full moon
  'mid-autumn-festival': 'https://images.unsplash.com/photo-1517315003714-a071486bd9ea?w=400&h=300&fit=crop&q=80',
  // Halloween - Jack-o-lantern, costumes, spooky
  'halloween': 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&h=300&fit=crop&q=80',
  // Bhai Dooj - Tilak, brother-sister, sweets
  'bhai-dooj': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop&q=80',
  // Kwanzaa - Kinara candles, African heritage
  'kwanzaa': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop&q=80',
  // Obon - Japanese lanterns, traditional dance
  'obon': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=300&fit=crop&q=80',
  // Songkran - Water splashing, Thai celebration
  'songkran': 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400&h=300&fit=crop&q=80',
  // Losar - Tibetan prayer flags, monastery
  'losar': 'https://images.unsplash.com/photo-1516746777433-e2f06a0d5ea4?w=400&h=300&fit=crop&q=80',
}

function FestivalCard({ festival }) {
  const emoji = festivalEmojis[festival.slug] || '🎉'
  const gradient = festivalGradients[festival.slug] || 'from-purple-400 to-pink-500'
  // Use API image if available, fallback to hardcoded images
  const image = festival.image?.image_url || festivalImages[festival.slug]

  return (
    <Link to={`/festivals/${festival.slug}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="card group cursor-pointer h-full overflow-hidden"
      >
        {/* Image Area */}
        <div className={`aspect-[4/3] sm:aspect-video rounded-lg sm:rounded-xl mb-3 sm:mb-4 relative overflow-hidden`}>
          {image ? (
            <>
              <img 
                src={image} 
                alt={festival.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent`} />
              {/* Emoji badge */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <span className="text-lg sm:text-xl">{emoji}</span>
              </div>
              {/* Festival name on image */}
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 right-2 sm:right-3">
                <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg drop-shadow-lg line-clamp-1">
                  {festival.name}
                </h3>
              </div>
            </>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <motion.span 
                className="text-4xl sm:text-5xl md:text-6xl"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {emoji}
              </motion.span>
            </div>
          )}

          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>

        {/* Content - only description */}
        {!image && (
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1 mb-2">
            {festival.name}
          </h3>
        )}

        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {festival.description}
        </p>
      </motion.div>
    </Link>
  )
}

export default FestivalCard
