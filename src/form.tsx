import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
    name: string;
    email: string;
    message: string;
}

export default function MultiStepForm() {
    const [step, setStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false); 
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        message: "",
    });

    const totalSteps: number = 3;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (isValidStep()) setStep((prev) => prev + 1);
    };

    const prevStep = () => setStep((prev) => prev - 1);

    const isValidStep = (): boolean => {
        if (step === 1 && !formData.name.trim()) return false;
        if (step === 2 && !formData.email.trim()) return false;
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("https://formsubmit.co/YOUR_EMAIL", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Form submitted successfully!");
                setFormData({ name: "", email: "", message: "" });
                setStep(1);
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            alert("Error submitting form.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.progressBarContainer}>
                <div style={{ ...styles.progressBar, width: `${(step / totalSteps) * 100}%` }} />
            </div>
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
                            <button onClick={prevStep} style={styles.button}>Back</button>
                            <button onClick={handleSubmit} style={styles.submitButton} disabled={loading}>
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface StepProps {
    title: string;
    inputType: string;
    inputName: keyof FormData;
    value: string;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    nextStep: () => void;
    prevStep?: () => void;
    disableNext: boolean;
}

function Step({ title, inputType, inputName, value, handleChange, nextStep, prevStep, disableNext }: StepProps) {
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
                {prevStep && <button onClick={prevStep} style={styles.button}>Back</button>}
                <button onClick={nextStep} style={styles.button} disabled={disableNext}>Next</button>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: { width: "300px", margin: "auto" },
    progressBarContainer: { height: "10px", background: "#eee", marginBottom: "10px" },
    progressBar: { height: "100%", background: "blue" },
    formWrapper: { padding: "20px", border: "1px solid #ccc", borderRadius: "5px" },
    step: { display: "flex", flexDirection: "column", alignItems: "center" },
    input: { width: "100%", padding: "10px", margin: "10px 0" },
    buttonGroup: { display: "flex", gap: "10px" },
    button: { padding: "10px", cursor: "pointer" },
    submitButton: { padding: "10px", cursor: "pointer", background: "green", color: "white" },
};
