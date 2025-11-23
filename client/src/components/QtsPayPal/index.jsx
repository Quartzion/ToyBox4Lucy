import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Overlay from "../Overlay";
import { jsPDF } from "jspdf";
import QtsLogo from "../../assets/QTS_L2_B_C.png"

export default function QtsPayPal() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [amount, setAmount] = useState("25.00");

  // PDF receipt generator
  const generateReceipt = (details, amount) => {
    const doc = new jsPDF();

    //logo
    doc.addImage(QtsLogo, "png", 80, 5, 50, 20)

    // Header
    doc.setFontSize(18);
    doc.text("Donation Receipt", 105, 40, { align: "center" });

    // Organization Info
    doc.setFontSize(12);
    doc.text("Quartzion Technology Solutions Corp.", 20, 60);
    doc.text("A 501(c)(3) Nonprofit Organization", 20, 68);
    doc.text("EIN: 33-4321549", 20, 76);

    // Donor Info
    doc.text(`Donor: ${details.payer.name.given_name} ${details.payer.name.surname}`, 20, 92);
    doc.text(`Email: ${details.payer.email_address}`, 20, 100);

    // Donation Info
    doc.text(`Donation Amount: $${amount}`, 20, 120);
    doc.text(`Transaction ID: ${details.id}`, 20, 128);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 136);

    // IRS Statement
    doc.text(
      "No goods or services were provided in exchange for this donation.",
      20,
      156,
      { maxWidth: 170 }
    );
    doc.text(
      "Donations are tax-deductible to the fullest extent permitted by law.",
      20,
      170,
      { maxWidth: 170 }
    );

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for supporting our mission!", 105, 280, { align: "center" });

    // Trigger download
    doc.save(`QTS-Donation-Receipt-${details.id}.pdf`);
  };

  return (
    <>
      <Button
        className="donate-to-qts-btn"
        variant="primary"
        onClick={() => setShowOverlay(true)}
      >
        💙 Donate to Quartzion 💙
      </Button>

      {showOverlay && (
        <Overlay className="card-overlay-bg" onClose={() => setShowOverlay(false)}>
          <div className="paypal-bg">
            <Form.Group controlId="donationAmount" style={{ marginBottom: "1rem" }}>
              <Form.Label>Donation Amount (USD)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ maxWidth: "200px" }}
              />
            </Form.Group>

            <PayPalButtons
              // key forces re-render when the amount changes
              key={amount}
              style={{ layout: "vertical", color: "gold", shape: "rect", label: "donate" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: amount || "25.00",
                      },
                    },
                  ],
                  // suppresses shipping fields
                  application_context: {
                    shipping_preference: "NO_SHIPPING",
                  },
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                  // success toast
                  alert(`Thank you for your donation ${details.payer.name.given_name}!
A receipt of this donation has been downloaded to your downloads folder. Keep this receipt for your records as it can be used for IRS tax deductions. Quartzion Technology Solutions Corp. is a 501(c)(3) nonprofit organization. Donations are tax-deductible to the fullest extent allowed by law.`);
                  // generate PDF receipt
                  generateReceipt(details, amount);
                  // close overlay 
                  setShowOverlay(false);
                });
              }}
            />

            <br />
            <p style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
              Quartzion Technology Solutions Corp. is a 501(c)(3) nonprofit organization. Donations are tax-deductible to the fullest extent allowed by law.
            </p>
            <Button
              className="close-donate-window-btn"
              variant="secondary"
              onClick={() => setShowOverlay(false)}
              aria-label="Close PayPal overlay"
            >
              Close Donation Window
            </Button>
          </div>
        </Overlay>
      )}
    </>
  );
}
