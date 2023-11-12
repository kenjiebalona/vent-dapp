import * as anchor from '@project-serum/anchor';
import { useEffect, useMemo, useState } from 'react';
import { VENT_PROGRAM_PUBKEY } from '../constants';
import ventIDL from '../constants/vent.json';
import toast from 'react-hot-toast';
import { SystemProgram } from '@solana/web3.js';
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { authorFilter } from '../utils';

export function useVent() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  const [initialized, setInitialized] = useState(false);
  const [lastVent, setLastVent] = useState(0);
  const [vents, setVents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [input, setInput] = useState('');
  const [allVents, setAllVents] = useState([]);

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(
        connection,
        anchorWallet,
        anchor.AnchorProvider.defaultOptions()
      );
      return new anchor.Program(ventIDL, VENT_PROGRAM_PUBKEY, provider);
    }
  }, [connection, anchorWallet]);

  useEffect(() => {
    const findProfileAccounts = async () => {
      if (program && publicKey && !transactionPending) {
        try {
          setLoading(true);
          const [profilePda, profileBump] = await findProgramAddressSync(
            [utf8.encode('USER_STATE'), publicKey.toBuffer()],
            program.programId
          );
          const profileAccount = await program.account.userProfile.fetch(
            profilePda
          );

          if (profileAccount) {
            setLastVent(profileAccount.lastVent);
            setInitialized(true);

            const ventAccounts = await program.account.ventAccount.all([
              authorFilter(publicKey.toString()),
            ]);
            setVents(ventAccounts);
          } else {
            console.log('Not yet initialized');
            setInitialized(false);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };
    findProfileAccounts();
    getAllVents();
  }, [publicKey, program, transactionPending]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const getAllVents = async () => {
    try {
      setLoading(true);
      const vents = await program.account.ventAccount.all();
      setAllVents(vents);
      console.log('GETT ALLL')
    } catch (error) {
      console.log(error);
      toast.error(error.toString());
      setAllVents([]);
    } finally {
      setLoading(false)
    }
  };

  const initializeUser = async () => {
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        const [profilePda, profileBump] = findProgramAddressSync(
          [utf8.encode('USER_STATE'), publicKey.toBuffer()],
          program.programId
        );

        const tx = await program.methods
          .initializeUser()
          .accounts({
            userProfile: profilePda,
            authority: publicKey,
            SystemProgram: SystemProgram.programId,
          })
          .rpc();

        setInitialized(true);
        toast.success('Successfully Initialized');
      } catch (error) {
        console.log(error);
        toast.error(error.toString());
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const addVent = async (e) => {
    e.preventDefault();
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        const [profilePda, profileBump] = findProgramAddressSync(
          [utf8.encode('USER_STATE'), publicKey.toBuffer()],
          program.programId
        );
        const [ventPda, ventBump] = findProgramAddressSync(
          [
            utf8.encode('VENT_STATE'),
            publicKey.toBuffer(),
            Uint8Array.from([lastVent]),
          ],
          program.programId
        );

        if (input) {
          await program.methods
            .addVent(input)
            .accounts({
              userProfile: profilePda,
              ventAccount: ventPda,
              authority: publicKey,
              systemProgram: SystemProgram.programId,
            })
            .rpc();
          toast.success('Successfully added vent.');
        }
      } catch (error) {
        console.log(error);
        toast.error(error.toString());
      } finally {
        setTransactionPending(false);
        setInput('');
      }
    }
  };

  const removeVent = async (todoPda, todoIdx) => {
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        setLoading(true);
        const [profilePda, profileBump] = findProgramAddressSync(
          [utf8.encode('USER_STATE'), publicKey.toBuffer()],
          program.programId
        );

        await program.methods
          .removeVent(todoIdx)
          .accounts({
            userProfile: profilePda,
            todoAccount: todoPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        toast.success('SUccessfully remove a Vent!');
      } catch (error) {
        console.log(error);
        toast.error(error.toString());
      } finally {
        setLoading(false);
        setTransactionPending(false);
      }
    }
  };

  const ownVents = useMemo(
    () => vents.filter((vent) => vent.account.marked),
    [vents]
  );

  return {
    initialized,
    initializeUser,
    loading,
    transactionPending,
    vents,
    removeVent,
    addVent,
    input,
    setInput,
    handleChange,
    allVents,
    getAllVents,
  };
}
