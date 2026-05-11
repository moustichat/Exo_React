// Barrel exports for backward compatibility
export { authService } from './auth-service';
export { eventService } from './event-service';
export { ticketService } from './ticket-service';
export { profileService } from './profile-service';

// Re-export eventService as organizerService for backward compatibility
export { eventService as organizerService } from './event-service';
