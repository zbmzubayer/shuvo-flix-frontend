import { getAllServices } from '@/services/service.service';

export default async function ServiceTable() {
  const services = await getAllServices();

  return (
    <div>
      {services.map((service) => (
        <div className="service-item" key={service.id}>
          <h3>{service.name}</h3>
          {/* Add more service details as needed */}
        </div>
      ))}
    </div>
  );
}
