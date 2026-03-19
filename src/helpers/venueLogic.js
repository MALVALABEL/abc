import Venue from '@/models/Venue';

export async function listVenues(filter = { active: true }) {
  return Venue.find(filter).sort({ order: 1 });
}

export async function getVenue(id) {
  return Venue.findById(id);
}

export async function createVenue(data) {
  return Venue.create(data);
}

export async function updateVenue(id, data) {
  return Venue.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteVenue(id) {
  return Venue.findByIdAndDelete(id);
}

export async function seedDefaultVenues() {
  const count = await Venue.countDocuments();
  if (count > 0) return;

  const defaults = [
    {
      name: 'Zona 43',
      slug: 'zona-43',
      imageUrl: 'https://pub-5fc99daf15b74e3ba338baec2584b710.r2.dev/abc/venues/zona_43.jpg',
      schedule: 'Lunes y Miercoles - 9:00 PM',
      order: 0,
    },
    {
      name: 'The Green Zone',
      slug: 'the-green-zone',
      imageUrl: 'https://pub-5fc99daf15b74e3ba338baec2584b710.r2.dev/abc/venues/the_green_zone.jpg',
      schedule: 'Martes y Jueves - 8:00 PM',
      order: 1,
    },
    {
      name: 'Cola del Zorro',
      slug: 'cola-del-zorro',
      imageUrl: 'https://pub-5fc99daf15b74e3ba338baec2584b710.r2.dev/abc/venues/the_green_zone.jpg',
      schedule: 'Viernes - 7:00 PM',
      order: 2,
    },
  ];

  await Venue.insertMany(defaults);
}
