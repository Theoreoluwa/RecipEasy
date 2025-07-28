import { Container, Card, Row, Image, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export default function UserProfile() {
  const authState = useSelector((state) => state.auth);

  return (
    <Container className="dashboard">
      <h1 className="text-center mt-5 heading" data-aos="fade-down">
        Profile
      </h1>
      <Card className="border-0 shadow" style={{ maxWidth: '450px', margin: '0 auto', overflow: 'hidden' }}>
        {/* Header with gradient background */}
        <div
          className="bg-primary position-relative"
          style={{
            height: '120px', // Increased height to accommodate the image
            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
          }}
        ></div>

        <Container className="px-4">
          {/* Profile image that overlaps the header */}
          <div className="text-center" style={{ marginTop: '-60px' }}>
            <Image
              src={authState.data.userprofile || '/user.png'}
              roundedCircle
              width={120}
              height={120}
              className="border border-4 border-white position-relative shadow-sm"
              style={{ objectFit: 'cover', backgroundColor: '#f8f9fa', zIndex: 10 }}
            />
          </div>

          {/* User information */}
          <div className="text-center pt-3 pb-4">
            {/* <h4 className="mb-1 fw-bold">John Smith</h4> */}
            <p className="text-muted mb-3">@{authState.data.username}</p>

            <Row className="justify-content-center mb-3">
              <Col xs="auto" className="d-flex align-items-center px-3">
                <i className="bi bi-envelope text-primary me-2"></i>
                <span>{authState.data.email}</span>
              </Col>
            </Row>

            <div className="d-flex justify-content-center align-items-center">
              <i className="bi bi-calendar-check text-primary me-2"></i>
              <span className="text-muted">Member since {new Date(authState.data.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </Container>
      </Card>
    </Container>
  );
}
