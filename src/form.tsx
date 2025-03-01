import { useState } from "react"

export default function MultiStepForm() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    })

    const totalSteps = 3 // Number of steps in the form

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const nextStep = () => {
        if (isValidStep()) setStep((prev) => prev + 1)
    }

    const prevStep = () => setStep((prev) => prev - 1)

    const isValidStep = () => {
        if (step === 1 && !formData.name.trim()) return false
        if (step === 2 && !formData.email.trim()) return false
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("https://formsubmit.co/YOUR_EMAIL", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                alert("Form submitted successfully!")
                setFormData({ name: "", email: "", message: "" }) // Reset form
                setStep(1) // Reset to first step
            } else {
                alert("Something went wrong. Please try again.")
            }
        } catch (error) {
            alert("Error submitting form.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            {/* Progress Bar */}
            <div style={styles.progressBarContainer}>
                <div
                    style={{
                        ...styles.progressBar,
                        width: `${(step / totalSteps) * 100}%`,
                    }}
                />
            </div>

            {/* Step Content */}
            <div style={styles.formWrapper}>
                {step === 1 && (
                    <Step
                        title="Step 1: Your Name"
                        inputType="text"
                        inputName="name"
                        value={formData.name}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        disableNext={!formData.name.trim()}
                    />
                )}

                {step === 2 && (
                    <Step
                        title="Step 2: Your Email"
                        inputType="email"
                        inputName="email"
                        value={formData.email}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        disableNext={!formData.email.trim()}
                    />
                )}

                {step === 3 && (
                    <div style={styles.step}>
                        <h2>Step 3: Your Message</h2>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Enter your message"
                            style={styles.input}
                        ></textarea>
                        <div style={styles.buttonGroup}>
                            <button onClick={prevStep} style={styles.button}>
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                style={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Reusable Step Component
function Step({ title, inputType, inputName, value, handleChange, nextStep, prevStep, disableNext }) {
    return (
        <div style={styles.step}>
            <h2>{title}</h2>
            <input
                type={inputType}
                name={inputName}
                value={value}
                onChange={handleChange}
                placeholder={`Enter your ${inputName}`}
                style={styles.input}
            />
            <div style={styles.buttonGroup}>
                {prevStep && (
                    <button onClick={prevStep} style={styles.button}>
                        Back
                    </button>
                )}
                <button onClick={nextStep} style={styles.button} disabled={disableNext}>
                    Next
                </button>
            </div>
        </div>
    )
}

 