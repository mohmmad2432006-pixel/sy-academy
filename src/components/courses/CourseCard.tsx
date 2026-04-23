import Link from 'next/link';
import { Star, Users, Clock, BookOpen, Play } from 'lucide-react';

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  reviewsCount: number;
  enrolled: number;
  duration: number;
  lessonsCount: number;
  price: number;
  originalPrice?: number;
  level: string;
  category: string;
  isFeatured?: boolean;
}

const levelColors: Record<string, string> = {
  'مبتدئ': 'bg-green-100 text-green-700',
  'متوسط': 'bg-yellow-100 text-yellow-700',
  'متقدم': 'bg-red-100 text-red-700',
};

export default function CourseCard({
  id, title, instructor, thumbnail, rating, reviewsCount,
  enrolled, duration, lessonsCount, price, originalPrice,
  level, isFeatured,
}: CourseCardProps) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Link href={`/courses/${id}`} className="block">
      <div className="card-hover group h-full flex flex-col overflow-hidden">
        {/* Thumbnail */}
        <div className="relative overflow-hidden bg-royal-100 aspect-video">
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-royal-100 to-royal-200">
              <BookOpen className="w-12 h-12 text-royal-400" />
            </div>
          )}

          {/* Hover play button */}
          <div className="absolute inset-0 bg-royal-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
              <Play className="w-6 h-6 text-royal-600 mr-[-2px]" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            {isFeatured && (
              <span className="badge bg-gold-500 text-white text-xs shadow-md">⭐ مميز</span>
            )}
            {discount > 0 && (
              <span className="badge bg-red-500 text-white text-xs shadow-md">-{discount}%</span>
            )}
          </div>

          {/* Level */}
          <div className="absolute bottom-3 left-3">
            <span className={`badge ${levelColors[level] || 'bg-gray-100 text-gray-700'} text-xs`}>
              {level}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 space-y-3">
          <h3 className="font-bold text-royal-900 leading-snug text-sm line-clamp-2 group-hover:text-royal-600 transition-colors">
            {title}
          </h3>
          <p className="text-royal-400 text-xs font-medium">{instructor}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'fill-gold-400 text-gold-400' : 'text-gray-200 fill-gray-200'}`} />
              ))}
            </div>
            <span className="text-gold-600 font-bold text-xs">{rating.toFixed(1)}</span>
            <span className="text-royal-300 text-xs">({reviewsCount.toLocaleString('ar')})</span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-royal-400 text-xs">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {enrolled.toLocaleString('ar')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {Math.floor(duration / 60)}س {duration % 60}د
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {lessonsCount} درس
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-2 border-t border-royal-50 mt-auto">
            <div className="flex items-center gap-2">
              {price === 0 ? (
                <span className="text-green-600 font-black text-lg">مجاني</span>
              ) : (
                <>
                  <span className="text-royal-900 font-black text-lg">{price.toLocaleString('ar')} ل.س</span>
                  {originalPrice && (
                    <span className="text-royal-300 text-xs line-through">{originalPrice.toLocaleString('ar')}</span>
                  )}
                </>
              )}
            </div>
            <div className="w-9 h-9 rounded-xl bg-royal-50 group-hover:bg-royal-600 flex items-center justify-center transition-colors">
              <Play className="w-4 h-4 text-royal-400 group-hover:text-white transition-colors mr-[-1px]" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
