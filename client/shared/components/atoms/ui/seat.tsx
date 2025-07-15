import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Car, X } from 'lucide-react';

type SeatStatus = 'available' | 'selected' | 'unavailable';
type SeatType = 'standard' | 'premium' | 'window' | 'aisle' | 'driver';

interface SeatProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  seatNumber: string;
  status: SeatStatus;
  onSeatClick?: (seatNumber: string) => void;
  isWindow?: boolean;
  isAisle?: boolean;
  seatType?: SeatType;
}

const Seat = React.forwardRef<HTMLButtonElement, SeatProps>(
  ({ className, seatNumber, status, onSeatClick, isWindow = false, isAisle = false, seatType = 'standard', ...props }, ref) => {
    const statusClasses = {
      available: 'bg-gradient-to-b from-blue-50 to-blue-100 text-blue-700 border-blue-400 hover:from-blue-100 hover:to-blue-200 hover:border-blue-600 hover:scale-105 shadow-sm',
      selected: 'bg-gradient-to-b from-green-400 to-green-600 text-white border-green-600 shadow-lg scale-105',
      unavailable: 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-60'
    };

    const seatTypeClasses = {
      standard: '',
      premium: 'w-14 h-14',
      window: 'border-l-4 border-l-sky-300',
      aisle: 'border-r-2 border-r-gray-300',
      driver: 'bg-gradient-to-b from-gray-600 to-gray-800'
    };

    const handleClick = () => {
      if (status !== 'unavailable' && onSeatClick) {
        onSeatClick(seatNumber);
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 text-xs font-bold border-2",
          // Seat cushion effect
          "before:content-[''] before:absolute before:top-1 before:left-1 before:w-[calc(100%-8px)] before:h-2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:rounded-t-md",
          // Seat back effect
          "after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-3 after:bg-gradient-to-b after:from-black/10 after:to-transparent after:rounded-t-lg",
          statusClasses[status],
          seatTypeClasses[seatType],
          isWindow && "border-l-4 border-l-sky-300 shadow-md",
          isAisle && "border-r-2 border-r-gray-300",
          className
        )}
        onClick={handleClick}
        disabled={status === 'unavailable'}
        title={`Siège ${seatNumber} - ${status === 'available' ? 'Disponible' : status === 'selected' ? 'Sélectionné' : 'Occupé'}${isWindow ? ' (Fenêtre)' : ''}${isAisle ? ' (Allée)' : ''}`}
        {...props}
      >
        {status === 'unavailable' && (
          <X className="absolute top-0 right-0 w-3 h-3 text-red-500 z-20" />
        )}
        <span className="relative z-10">{seatNumber}</span>
      </button>
    );
  }
);
Seat.displayName = "Seat";

const DriverSeat = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-b from-gray-600 to-gray-800 text-white border-2 border-gray-700 shadow-lg",
          // Driver seat padding effect
          "before:content-[''] before:absolute before:top-1 before:left-1 before:w-[calc(100%-8px)] before:h-2 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:rounded-t-md",
          // Driver seat back effect
          "after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-3 after:bg-gradient-to-b after:from-black/20 after:to-transparent after:rounded-t-lg",
          className
        )}
        title="Chauffeur"
        {...props}
      >
        <Car className="w-5 h-5 relative z-10" />
      </div>
    );
  }
);
DriverSeat.displayName = "DriverSeat";

const EmptySpace = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-12 h-12 bg-transparent", className)}
        {...props}
      />
    );
  }
);
EmptySpace.displayName = "EmptySpace";

const BusAisle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-8 h-12 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-150 border-l border-r border-gray-300 border-dashed opacity-60 rounded-sm",
          "relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2",
          "before:w-4 before:h-0.5 before:bg-gray-400 before:rounded-full",
          className
        )}
        title="Allée centrale"
        {...props}
      />
    );
  }
);
BusAisle.displayName = "BusAisle";

interface BusLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  busNumber?: string;
}

const BusLayout = React.forwardRef<HTMLDivElement, BusLayoutProps>(
  ({ className, children, busNumber = "BUS-001", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative max-w-md mx-auto p-8 bg-gradient-to-b from-slate-100 via-white to-slate-100 rounded-3xl border-4 border-slate-300 shadow-2xl",
          // Front windshield
          "before:content-[''] before:absolute before:top-3 before:left-1/2 before:transform before:-translate-x-1/2 before:w-20 before:h-2 before:bg-gradient-to-r before:from-sky-200 before:via-sky-100 before:to-sky-200 before:rounded-full before:border before:border-sky-300",
          // Rear window
          "after:content-[''] after:absolute after:bottom-3 after:left-1/2 after:transform after:-translate-x-1/2 after:w-24 after:h-2 after:bg-gradient-to-r after:from-gray-300 after:via-gray-200 after:to-gray-300 after:rounded-full after:border after:border-gray-400",
          className
        )}
        {...props}
      >
        {/* Bus number plate */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 py-1.5 rounded-md text-sm font-bold shadow-md border border-primary-dark">
          {busNumber}
        </div>
        
        {/* Bus interior */}
        <div className="mt-8 space-y-3">
          {children}
        </div>
        
        {/* Emergency exits indicators */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1.5 h-10 bg-red-500 rounded-full shadow-sm" title="Sortie de secours"></div>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-1.5 h-10 bg-red-500 rounded-full shadow-sm" title="Sortie de secours"></div>
        
        {/* Side windows indicators */}
        <div className="absolute left-0 top-8 bottom-8 w-0.5 bg-gradient-to-b from-transparent via-sky-200 to-transparent opacity-50"></div>
        <div className="absolute right-0 top-8 bottom-8 w-0.5 bg-gradient-to-b from-transparent via-sky-200 to-transparent opacity-50"></div>
      </div>
    );
  }
);
BusLayout.displayName = "BusLayout";

interface BusRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  rowNumber?: number;
}

const BusRow = React.forwardRef<HTMLDivElement, BusRowProps>(
  ({ className, children, rowNumber, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center gap-1.5 mb-2 last:mb-0 relative", className)}
        {...props}
      >
        {/* Row number indicator */}
        {rowNumber && (
          <span className="absolute -left-8 text-sm text-gray-500 font-semibold w-6 text-center bg-gray-100 rounded-md py-1 border border-gray-200">
            {rowNumber}
          </span>
        )}
        {children}
      </div>
    );
  }
);
BusRow.displayName = "BusRow";

// Configuration type for different bus layouts
interface BusConfig {
  name: string;
  totalSeats: number;
  layout: 'standard' | 'premium' | 'luxury' | 'double-decker';
  seatsPerRow: number[];
  hasAisle: boolean;
  frontRows: number; // Nombre de rangées avant (chauffeur, bagages)
  exitRows?: number[]; // Rangées de sortie d'urgence
}

interface SeatData {
  id: string;
  number: string;
  row: number;
  position: 'left' | 'right' | 'center' | 'driver';
  isWindow: boolean;
  isAisle: boolean;
  status: SeatStatus;
}

const busConfigs: Record<string, BusConfig> = {
  standard: {
    name: "Bus Standard",
    totalSeats: 50,
    layout: 'standard',
    seatsPerRow: [2, 2], // 2 sièges gauche, 2 sièges droite
    hasAisle: true,
    frontRows: 1,
    exitRows: [6, 11]
  },
  premium: {
    name: "Bus Premium", 
    totalSeats: 33,
    layout: 'premium',
    seatsPerRow: [2, 1], // 2 sièges gauche, 1 siège droite
    hasAisle: true,
    frontRows: 1,
    exitRows: [5, 9]
  },
  luxury: {
    name: "Bus Luxe",
    totalSeats: 24,
    layout: 'luxury',
    seatsPerRow: [1, 1], // 1 siège gauche, 1 siège droite
    hasAisle: true,
    frontRows: 2,
    exitRows: [4, 8]
  }
};

// Générateur automatique de sièges selon la configuration
const generateBusSeats = (config: BusConfig): SeatData[] => {
  const seats: SeatData[] = [];
  let seatCounter = 1;

  // Calcul du nombre de rangées de passagers
  const totalRows = Math.ceil((config.totalSeats - 2) / (config.seatsPerRow[0] + config.seatsPerRow[1]));
  
  // Sièges à côté du chauffeur (rangée 0)
  for (let i = 0; i < 2; i++) {
    seats.push({
      id: `driver-${i}`,
      number: `${seatCounter}`,
      row: 0,
      position: 'right',
      isWindow: i === 1,
      isAisle: i === 0,
      status: Math.random() > 0.8 ? 'unavailable' : 'available'
    });
    seatCounter++;
  }

  // Rangées principales de passagers
  for (let row = 1; row <= totalRows; row++) {
    const [leftSeats, rightSeats] = config.seatsPerRow;
    
    // Sièges de gauche
    for (let i = 0; i < leftSeats; i++) {
      seats.push({
        id: `${row}-L${i}`,
        number: `${seatCounter}`,
        row,
        position: 'left',
        isWindow: i === 0, // Premier siège = fenêtre
        isAisle: i === leftSeats - 1, // Dernier siège = allée
        status: Math.random() > 0.85 ? 'unavailable' : 'available'
      });
      seatCounter++;
    }
    
    // Sièges de droite
    for (let i = 0; i < rightSeats; i++) {
      seats.push({
        id: `${row}-R${i}`,
        number: `${seatCounter}`,
        row,
        position: 'right',
        isWindow: i === rightSeats - 1, // Dernier siège = fenêtre
        isAisle: i === 0, // Premier siège = allée
        status: Math.random() > 0.85 ? 'unavailable' : 'available'
      });
      seatCounter++;
    }
  }

  return seats;
};

export { Seat, DriverSeat, EmptySpace, BusAisle, BusLayout, BusRow, busConfigs, generateBusSeats };
export type { SeatStatus, SeatType, BusConfig, SeatData };
