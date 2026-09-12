import sys
sys.path.insert(0, 'src')

from src.global_bank import BankManager
from src.broker.co_broker import GlobalTransactionBroker
from src.engine.cobol import FinancialEngine


def main():
    # Initialize the bank manager for global transaction handling and interface validation
    broker = GlobalTransactionBroker()
    
    engine = FinancialEngine(broker)
    
    try:
        engine.run_simulation()
    except Exception as e:
        print(f"Simulation failed with error {e}")

if __name__ == "__main__":
    main()
