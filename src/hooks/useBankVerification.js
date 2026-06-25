import { useState, useCallback, useRef } from 'react';

const BANK_DATABASE = {
  'SBIN': {
    name: 'State Bank of India',
    shortName: 'SBI',
    logo: '🏛️',
    color: '#1a237e',
    gradient: 'linear-gradient(135deg, #1a237e, #0d47a1)',
    prefixes: ['1', '2', '3', '5', '6'],
    accountLengths: [11, 14, 17],
    ifscPattern: /^SBIN0\d{6}$/,
    type: 'PSU',
    established: 1955
  },
  'HDFC': {
    name: 'HDFC Bank',
    shortName: 'HDFC',
    logo: '🔷',
    color: '#004c8f',
    gradient: 'linear-gradient(135deg, #004c8f, #0066cc)',
    prefixes: ['0', '1', '2', '5'],
    accountLengths: [13, 14],
    ifscPattern: /^HDFC0\d{6}$/,
    type: 'Private',
    established: 1994
  },
  'ICIC': {
    name: 'ICICI Bank',
    shortName: 'ICICI',
    logo: '🟠',
    color: '#f37920',
    gradient: 'linear-gradient(135deg, #b5651d, #f37920)',
    prefixes: ['0', '1', '6'],
    accountLengths: [12],
    ifscPattern: /^ICIC0\d{6}$/,
    type: 'Private',
    established: 1994
  },
  'UTIB': {
    name: 'Axis Bank',
    shortName: 'Axis',
    logo: '🟣',
    color: '#97144d',
    gradient: 'linear-gradient(135deg, #97144d, #c2185b)',
    prefixes: ['9', '0', '1'],
    accountLengths: [15],
    ifscPattern: /^UTIB0\d{6}$/,
    type: 'Private',
    established: 1993
  },
  'PUNB': {
    name: 'Punjab National Bank',
    shortName: 'PNB',
    logo: '🔴',
    color: '#d32f2f',
    gradient: 'linear-gradient(135deg, #b71c1c, #d32f2f)',
    prefixes: ['0', '1', '2', '3', '4'],
    accountLengths: [16],
    ifscPattern: /^PUNB0\d{6}$/,
    type: 'PSU',
    established: 1894
  },
  'BARB': {
    name: 'Bank of Baroda',
    shortName: 'BOB',
    logo: '🟡',
    color: '#f57c00',
    gradient: 'linear-gradient(135deg, #e65100, #ff9800)',
    prefixes: ['0', '1', '2'],
    accountLengths: [14],
    ifscPattern: /^BARB0\w{6}$/,
    type: 'PSU',
    established: 1908
  },
  'KKBK': {
    name: 'Kotak Mahindra Bank',
    shortName: 'Kotak',
    logo: '🔶',
    color: '#e53935',
    gradient: 'linear-gradient(135deg, #c62828, #e53935)',
    prefixes: ['1', '5', '9'],
    accountLengths: [14],
    ifscPattern: /^KKBK0\d{6}$/,
    type: 'Private',
    established: 2003
  },
  'YESB': {
    name: 'Yes Bank',
    shortName: 'Yes',
    logo: '🔵',
    color: '#0033a0',
    gradient: 'linear-gradient(135deg, #001f7a, #0033a0)',
    prefixes: ['0', '1'],
    accountLengths: [15],
    ifscPattern: /^YESB0\d{6}$/,
    type: 'Private',
    established: 2004
  },
  'INDB': {
    name: 'IndusInd Bank',
    shortName: 'IndusInd',
    logo: '💎',
    color: '#880e4f',
    gradient: 'linear-gradient(135deg, #560027, #880e4f)',
    prefixes: ['1', '2'],
    accountLengths: [14],
    ifscPattern: /^INDB0\d{6}$/,
    type: 'Private',
    established: 1994
  },
  'UBIN': {
    name: 'Union Bank of India',
    shortName: 'UBI',
    logo: '🟤',
    color: '#e65100',
    gradient: 'linear-gradient(135deg, #bf360c, #e65100)',
    prefixes: ['0', '3', '5'],
    accountLengths: [15],
    ifscPattern: /^UBIN0\d{6}$/,
    type: 'PSU',
    established: 1919
  },
  'CNRB': {
    name: 'Canara Bank',
    shortName: 'Canara',
    logo: '🏦',
    color: '#1565c0',
    gradient: 'linear-gradient(135deg, #0d47a1, #1565c0)',
    prefixes: ['0', '1', '2'],
    accountLengths: [13],
    ifscPattern: /^CNRB0\d{6}$/,
    type: 'PSU',
    established: 1906
  },
  'BKID': {
    name: 'Bank of India',
    shortName: 'BOI',
    logo: '⭐',
    color: '#ff6f00',
    gradient: 'linear-gradient(135deg, #e65100, #ff6f00)',
    prefixes: ['0', '5', '8'],
    accountLengths: [15],
    ifscPattern: /^BKID0\d{6}$/,
    type: 'PSU',
    established: 1906
  },
  'IDIB': {
    name: 'Indian Bank',
    shortName: 'IB',
    logo: '🏛️',
    color: '#1b5e20',
    gradient: 'linear-gradient(135deg, #1b5e20, #388e3c)',
    prefixes: ['6', '7', '8'],
    accountLengths: [15],
    ifscPattern: /^IDIB0\d{6}$/,
    type: 'PSU',
    established: 1907
  },
  'FDRL': {
    name: 'Federal Bank',
    shortName: 'Federal',
    logo: '🔹',
    color: '#1565c0',
    gradient: 'linear-gradient(135deg, #0d47a1, #42a5f5)',
    prefixes: ['1', '2'],
    accountLengths: [14],
    ifscPattern: /^FDRL0\d{6}$/,
    type: 'Private',
    established: 1931
  },
  'IDFB': {
    name: 'IDFC First Bank',
    shortName: 'IDFC',
    logo: '🟢',
    color: '#b71c1c',
    gradient: 'linear-gradient(135deg, #880e4f, #d32f2f)',
    prefixes: ['1', '2'],
    accountLengths: [14],
    ifscPattern: /^IDFB0\d{6}$/,
    type: 'Private',
    established: 2015
  },
  'RATN': {
    name: 'RBL Bank',
    shortName: 'RBL',
    logo: '🟡',
    color: '#004d40',
    gradient: 'linear-gradient(135deg, #004d40, #00796b)',
    prefixes: ['4', '5'],
    accountLengths: [12],
    ifscPattern: /^RATN0\d{6}$/,
    type: 'Private',
    established: 1943
  },
  'SIBL': {
    name: 'South Indian Bank',
    shortName: 'SIB',
    logo: '🌴',
    color: '#1a237e',
    gradient: 'linear-gradient(135deg, #1a237e, #3f51b5)',
    prefixes: ['0', '1'],
    accountLengths: [14],
    ifscPattern: /^SIBL0\d{6}$/,
    type: 'Private',
    established: 1929
  },
  'BDBL': {
    name: 'Bandhan Bank',
    shortName: 'Bandhan',
    logo: '🤝',
    color: '#c62828',
    gradient: 'linear-gradient(135deg, #b71c1c, #ef5350)',
    prefixes: ['1', '2'],
    accountLengths: [15],
    ifscPattern: /^BDBL0\d{6}$/,
    type: 'Private',
    established: 2015
  },
  'UCBA': {
    name: 'UCO Bank',
    shortName: 'UCO',
    logo: '🏦',
    color: '#4a148c',
    gradient: 'linear-gradient(135deg, #4a148c, #7b1fa2)',
    prefixes: ['0', '1'],
    accountLengths: [14],
    ifscPattern: /^UCBA0\d{6}$/,
    type: 'PSU',
    established: 1943
  },
  'IOBA': {
    name: 'Indian Overseas Bank',
    shortName: 'IOB',
    logo: '🌊',
    color: '#0d47a1',
    gradient: 'linear-gradient(135deg, #01579b, #0288d1)',
    prefixes: ['0', '1', '3'],
    accountLengths: [15],
    ifscPattern: /^IOBA0\d{6}$/,
    type: 'PSU',
    established: 1937
  }
};

// ✅ FIXED: Removed unused holderNames array
// ✅ FIXED: throw proper Error objects instead of literals
const simulateBankVerification = async (accountNumber, ifscCode) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bankCode = ifscCode?.substring(0, 4)?.toUpperCase();
      const bank = BANK_DATABASE[bankCode];

      if (!bank) {
        // ✅ FIXED: throw new Error() object, not a literal object
        reject(new Error('Bank not recognized. Please check your IFSC code.'));
        return;
      }

      // Validate account number length for detected bank
      if (!bank.accountLengths.includes(accountNumber.length)) {
        // ✅ FIXED: throw new Error() object, not a literal object
        reject(
          new Error(
            `Invalid account number length for ${bank.name}. ` +
            `Expected ${bank.accountLengths.join(' or ')} digits.`
          )
        );
        return;
      }

      resolve({
        verified: true,
        bankName: bank.name,
        bankCode: bankCode,
        bankLogo: bank.logo,
        bankColor: bank.color,
        bankGradient: bank.gradient,
        bankType: bank.type,
        branchName: 'Main Branch',
        accountHolderName: '●●●●●● ●●●●●',
        accountType: 'Savings',
        micr: '●●●●●●●●●',
        city: '●●●●●',
        state: '●●●●●',
        verificationTimestamp: new Date().toISOString(),
        _securityMeta: {
          verificationId: `VRF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          expiresAt: Date.now() + 300000,
          attempts: 1
        }
      });
    }, 2000);
  });
};

const useBankVerification = () => {
  const [verificationState, setVerificationState] = useState({
    isVerifying: false,
    isVerified: false,
    bankDetails: null,
    error: null,
    attempts: 0,
    maxAttempts: 5,
    cooldownUntil: null
  });

  const abortControllerRef = useRef(null);

  const verifyAccount = useCallback(async (accountNumber, ifscCode) => {
    if (verificationState.attempts >= verificationState.maxAttempts) {
      const cooldownEnd = Date.now() + 900000;
      setVerificationState(prev => ({
        ...prev,
        error: '🚫 Too many attempts. Please try again after 15 minutes.',
        cooldownUntil: cooldownEnd
      }));
      return;
    }

    if (verificationState.cooldownUntil && Date.now() < verificationState.cooldownUntil) {
      const remainingMin = Math.ceil((verificationState.cooldownUntil - Date.now()) / 60000);
      setVerificationState(prev => ({
        ...prev,
        error: `⏳ Please wait ${remainingMin} minutes before trying again.`
      }));
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setVerificationState(prev => ({
      ...prev,
      isVerifying: true,
      error: null,
      bankDetails: null
    }));

    try {
      if (!accountNumber || accountNumber.length < 9) {
        throw new Error('Account number must be at least 9 digits');
      }
      if (!ifscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase())) {
        throw new Error('Invalid IFSC code format (e.g., SBIN0001234)');
      }

      /*
       * TODO: PRODUCTION API INTEGRATION
       * Replace simulateBankVerification with real API:
       *
       * const response = await fetch('/api/verify-bank', {
       *   method: 'POST',
       *   headers: {
       *     'Content-Type': 'application/json',
       *     'Authorization': `Bearer ${sessionToken}`,
       *     'X-CSRF-Token': csrfToken,
       *   },
       *   body: JSON.stringify({
       *     encrypted_account: await encryptData(accountNumber),
       *     encrypted_ifsc: await encryptData(ifscCode),
       *     timestamp: Date.now(),
       *   }),
       *   signal: abortControllerRef.current.signal
       * });
       * if (!response.ok) throw new Error(await response.text());
       * const result = await response.json();
       */

      const result = await simulateBankVerification(accountNumber, ifscCode);

      setVerificationState(prev => ({
        ...prev,
        isVerifying: false,
        isVerified: true,
        bankDetails: result,
        attempts: prev.attempts + 1,
        error: null
      }));

      return result;

    } catch (error) {
      setVerificationState(prev => ({
        ...prev,
        isVerifying: false,
        isVerified: false,
        bankDetails: null,
        attempts: prev.attempts + 1,
        // ✅ Now error.message always works since we throw Error objects
        error: error.message || '❌ Verification failed. Please check your details.'
      }));
      return null;
    }
  }, [verificationState.attempts, verificationState.maxAttempts, verificationState.cooldownUntil]);

  const resetVerification = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setVerificationState(prev => ({
      isVerifying: false,
      isVerified: false,
      bankDetails: null,
      error: null,
      attempts: prev.attempts,
      maxAttempts: 5,
      cooldownUntil: prev.cooldownUntil
    }));
  }, []);

  const getBankFromIFSC = useCallback((ifsc) => {
    if (!ifsc || ifsc.length < 4) return null;
    const bankCode = ifsc.substring(0, 4).toUpperCase();
    return BANK_DATABASE[bankCode] || null;
  }, []);

  return {
    ...verificationState,
    verifyAccount,
    resetVerification,
    getBankFromIFSC,
    BANK_DATABASE
  };
};

export default useBankVerification;