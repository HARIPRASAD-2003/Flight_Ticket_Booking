import React, { useEffect, useState } from 'react';
import './Home.css';
import InputField from '../../Components/InputField/InputField';

const Home = ({ user, profile, url }) => {
  const pageSize = 5; // Number of flights per page
  const [flights, setFlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFlights, setTotalFlights] = useState(0);
  const [searchParams, setSearchParams] = useState({ from: '', to: '', date: '' });
  const [newFlight, setNewFlight] = useState({
    f_name: '',
    f_from: '',
    f_to: '',
    f_date: '',
    f_arrive: '',
    f_depart: '',
    avt: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [passengerDetailsname, setPassengerDetailsname] = useState('');
  const [passengerDetailsage, setPassengerDetailsage] = useState('');

  const [selectedFlight, setSelectedFlight] = useState(null);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPassengerDetailsname('');
    setPassengerDetailsage('');
  };

  const TicketModal = ({ showModal, closeModal, passengerDetailsage, setPassengerDetailsage, passengerDetailsname, setPassengerDetailsname, handleBookTicket, flight }) => {
    return (
      showModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2>Enter Passenger Details</h2>
            <label htmlFor='bookname'>Name:</label>
            <input
              type='text'
              value={passengerDetailsname}
              onChange={(e) => setPassengerDetailsname(e.target.value)}
            />
            <label htmlFor='bookage'>Age:</label>
            <input
              type='number'
              id=''
              value={passengerDetailsage}
              onChange={(e) => setPassengerDetailsage(e.target.value )}
            />
            <button onClick={() => handleBookTicket(flight)}>Book Ticket</button>
            <button onClick={() => closeModal()}>Cancel</button>
          </div>
        </div>
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlight({
      ...newFlight,
      [name]: value,
    });
  };

  const handleAddFlight = async() => {
    try {
      const response = await fetch(url+'/api/add-flight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFlight),
      });

      if (!response.ok) {
        throw new Error('Flight addition failed');
      }

      setNewFlight({
        f_name: '',
        f_from: '',
        f_to: '',
        f_date: '',
        f_arrive: '',
        f_depart: '',
        avt: 0,
      });
      getAllFlights();
    } catch (error) {
      console.error('Flight addition error', error);
    }
  };

  const getAllFlights = async () => {
    try {
      const response = await fetch(url+`/api/all-flights?page=${currentPage}&pageSize=${pageSize}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }

      const data = await response.json();
      setFlights(data.flights);
      setTotalFlights(data.totalFlights);
    } catch (error) {
      console.log('Get all flights fetch failed', error);
    }
  };

  const handleBookTicket = async(flight) => {
    try {
      
      if (!passengerDetailsname || !passengerDetailsage) {
        alert('Please provide both name and age for the passenger.');
        return;
      }

      const response = await fetch(url+'/api/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flight_id: flight.f_id,
          user_id: user.user_id,
          name: passengerDetailsname,
          age: passengerDetailsage,
        }),
      });

      if (response.ok) {
        closeModal();
        getAllFlights();
        console.log('Ticket booked successfully!');
      } else {
        console.error('Booking failed');
        const errorData = await response.json();
        console.log('Error details:', errorData);
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error booking ticket', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleTicket = async (flight) => {
    if(profile===null) {
      alert('login to book tickets');
      return;
    } 
    setSelectedFlight(flight);
    openModal();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // const handleSearch = () => {
  //   getAllFlights();
  // };

  useEffect(() => {
    getAllFlights();
  }, [currentPage, searchParams]);

  return (
    <div className='Home-main'>
      <div className='Search'>
        {/* <input
          type='text'
          placeholder='From'
          value={searchParams.from}
          onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
        />
        <input
          type='text'
          placeholder='To'
          value={searchParams.to}
          onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
        />
        <input
          type='date'
          placeholder='Date'
          value={searchParams.date}
          onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
        /> */}
        <InputField type={'text'} Name={'From'} value={searchParams.from} onChanges={(e) => setSearchParams({ ...searchParams, from: e.target.value })}/>
        <InputField type={'text'} Name={'To'} value={searchParams.to} onChanges={(e) => setSearchParams({ ...searchParams, to: e.target.value })}/>
        <InputField type={'date'} Name={'Date'} value={searchParams.date} onChanges={(e) => setSearchParams({ ...searchParams, date: e.target.value })}/>

        {/* <button onClick={handleSearch}>Search</button> */}
      </div>

      <div className='Table'>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Flight No</th>
              <th>Flight Name</th>
              <th>FROM</th>
              <th>TO</th>
              <th>Date</th>
              <th>Arrival</th>
              <th>Departure</th>
              <th>Available Tickets</th>
              <th>Book Tickets</th>
            </tr>
          </thead>
          <tbody>
            {flights?.length > 0 ? (
              flights.map((flight, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>Air_{flight.f_id}</td>
                  <td>{flight.f_name}</td>
                  <td>{flight.f_from}</td>
                  <td>{flight.f_to}</td>
                  <td>
                    {new Date(flight.f_date).toLocaleDateString('en-GB', {
                      month: 'long',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td>{new Date(flight.f_date + ' ' + flight.f_arrive).toLocaleTimeString()}</td>
                  <td>{new Date(flight.f_date + ' ' + flight.f_depart).toLocaleTimeString()}</td>
                  <td className='d_center'>{flight.avt}</td>
                  <td>
                    <button type='button' onClick={() => handleTicket(flight)}>
                      Book Tickets
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='10' className='no-flights-message'>
                  No flights available at the moment
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className='page-controls'>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Back
          </button>
          <div>
            <span>{`Page ${currentPage} of ${Math.ceil(totalFlights / pageSize)}`}</span>
          </div>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage * pageSize >= totalFlights}>
            Next
          </button>
        </div>
      </div>
      {profile === 'admin' && (
        <div className='AdminPanel' style={{justifyContent: 'center'}}>
          <h2>Add New Flight</h2>
          <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
            {/* <label>Flight Name</label> */}
            <InputField type={'text'} Name={'Flight_Name'} value={newFlight.f_name} onChanges={(e) => setNewFlight({...newFlight, f_name: e.target.value,})}/>
            {/* <input type='text' name='f_name' value={newFlight.f_name} onChange={handleInputChange} /> */}

            {/* <label>From</label> */}
            <InputField type={'text'} Name={'From'} value={newFlight.f_from} onChanges={(e) => setNewFlight({...newFlight, f_from: e.target.value,})}/>
            <InputField type={'text'} Name={'To'} value={newFlight.f_to} onChanges={(e) => setNewFlight({...newFlight, f_to: e.target.value,})}/>
            <InputField type={'date'} Name={'Date'} value={newFlight.f_date} onChanges={(e) => setNewFlight({...newFlight, f_date: e.target.value,})}/>
            <InputField type={'time'} Name={'Arrival_Time'} value={newFlight.f_arrive} onChanges={(e) => setNewFlight({...newFlight, f_arrive: e.target.value,})}/>
            <InputField type={'time'} Name={'Departure_Time'} value={newFlight.f_depart} onChanges={(e) => setNewFlight({...newFlight, f_depart: e.target.value,})}/>
            <InputField type={'number'} Name={'Available_Tickets'} value={newFlight.avt} onChanges={(e) => setNewFlight({...newFlight, avt: e.target.value,})}/>

            {/* <input type='text' name='f_from' value={newFlight.f_from} onChange={handleInputChange} /> */}
{/* 
            <label>To</label>
            <input type='text' name='f_to' value={newFlight.f_to} onChange={handleInputChange} />

            <label>Date</label>
            <input type='date' name='f_date' value={newFlight.f_date} onChange={handleInputChange} />

            <label>Arrival Time</label>
            <input type='time' name='f_arrive' value={newFlight.f_arrive} onChange={handleInputChange} />

            <label>Departure Time</label>
            <input type='time' name='f_depart' value={newFlight.f_depart} onChange={handleInputChange} />

            <label>Available Tickets</label>
            <input type='number' name='avt' value={newFlight.avt} onChange={handleInputChange} /> */}

          </div>
            <button onClick={handleAddFlight}>Add Flight</button>
        </div>
      )}
    {/* <TicketModal
        showModal={showModal}
        closeModal={closeModal}
        passengerDetailsname={passengerDetailsname}
        setPassengerDetailsname={setPassengerDetailsname}
        passengerDetailsage={passengerDetailsage}
        setPassengerDetailsage={setPassengerDetailsage}
        handleBookTicket={handleBookTicket}
        flight={selectedFlight}
      /> */}
      {showModal && 
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2>Enter Passenger Details</h2>
            <label htmlFor='bookname'>Name:</label>
            <input
              type='text'
              value={passengerDetailsname}
              onChange={(e) => setPassengerDetailsname(e.target.value)}
            />
            <label htmlFor='bookage'>Age:</label>
            <input
              type='number'
              id=''
              value={passengerDetailsage}
              onChange={(e) => setPassengerDetailsage(e.target.value )}
            />
            <button onClick={() => handleBookTicket(selectedFlight)}>Book Ticket</button>
            <button onClick={() => closeModal()}>Cancel</button>
          </div>
        </div>}

    </div>
  );
};

export default Home;
