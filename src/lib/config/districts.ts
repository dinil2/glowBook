export interface District {
  id: string;
  name: string;
  popularAreas: string[];
  popular?: boolean;
}

export const SRI_LANKA_DISTRICTS: District[] = [
  {
    id: 'colombo',
    name: 'Colombo',
    popular: true,
    popularAreas: [
      'Colombo 03 (Kollupitiya)',
      'Colombo 07 (Cinnamon Gardens)',
      'Rajagiriya',
      'Nugegoda',
      'Dehiwala',
      'Pita Kotte',
      'Mount Lavinia',
      'Battaramulla',
      'Kohuwala',
      'Maharagama',
    ],
  },
  {
    id: 'kandy',
    name: 'Kandy',
    popular: true,
    popularAreas: ['Kandy City', 'Peradeniya', 'Katugastota', 'Kundasale'],
  },
  {
    id: 'galle',
    name: 'Galle',
    popular: true,
    popularAreas: ['Galle Fort', 'Karapitiya', 'Unawatuna', 'Hikkaduwa'],
  },
  {
    id: 'gampaha',
    name: 'Gampaha',
    popular: true,
    popularAreas: ['Negombo', 'Kelaniya', 'Kadawatha', 'Ja-Ela', 'Wattala'],
  },
  {
    id: 'kurunegala',
    name: 'Kurunegala',
    popularAreas: ['Kurunegala City', 'Wariyapola', 'Mawathagama'],
  },
  {
    id: 'matara',
    name: 'Matara',
    popularAreas: ['Matara City', 'Mirissa', 'Weligama'],
  },
  {
    id: 'jaffna',
    name: 'Jaffna',
    popularAreas: ['Jaffna Town', 'Nallur', 'Chavakachcheri'],
  },
  {
    id: 'anuradhapura',
    name: 'Anuradhapura',
    popularAreas: ['New Town', 'Old Town'],
  },
  {
    id: 'ratnapura',
    name: 'Ratnapura',
    popularAreas: ['Ratnapura Town', 'Pelmadulla'],
  },
  {
    id: 'kalutara',
    name: 'Kalutara',
    popularAreas: ['Panadura', 'Kalutara South', 'Wadduwa', 'Beruwala'],
  },
  {
    id: 'badulla',
    name: 'Badulla',
    popularAreas: ['Badulla City', 'Ella', 'Bandarawela'],
  },
  {
    id: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    popularAreas: ['Nuwara Eliya Town', 'Hatton'],
  },
];

export const POPULAR_DISTRICTS = SRI_LANKA_DISTRICTS.filter((d) => d.popular);
