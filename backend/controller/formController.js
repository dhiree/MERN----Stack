import Candidate from '../models/formModel.js';

const validateDateOfBirth = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const age = (new Date() - birthDate) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 18;
};

export const submitCandidate = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            dateOfBirth,
            residentialAddress,
            permanentAddress,
            sameAsResidential,
        } = req.body;

        if (!validateDateOfBirth(dateOfBirth)) {
            return res.status(400).json({ error: 'Candidate must be at least 18 years old' });
        }

        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ error: 'At least two documents are required' });
        }

        const documents = req.files.map(file => ({
            fileName: file.originalname,
            fileType: file.mimetype,
            filePath: file.path,
        }));

        const candidateData = {
            firstName,
            lastName,
            email,
            dateOfBirth,
            residentialAddress,
            permanentAddress: sameAsResidential ? residentialAddress : permanentAddress,
            documents,
        };

        const candidate = new Candidate(candidateData);
        await candidate.save();

        res.status(201).json({ message: 'Candidate data submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while submitting the form' });
    }
};
