export class Booking {
  public clientName: string;
  public bookingId: string;
  public bookingTime: string;
  public streetAddres: string;
  public bookingPrice: number;

  constructor(clientObj) {
    const {
      bookingId,
      tutenUserClient: { firstName, lastName },
      bookingTime,
      locationId: { streetAddress  },
      bookingPrice
    } = clientObj

    this.clientName = firstName + ' ' + lastName;
    this.bookingId = bookingId;
    this.bookingTime = new Date(bookingTime).toLocaleDateString();
    this.bookingPrice = bookingPrice;
    this.streetAddres = streetAddress ;
  }
}