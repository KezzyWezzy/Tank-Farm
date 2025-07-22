from modbus_tk import modbus_tcp, hooks
import modbus_tk.defines as cst
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    try:
        logger.info("Starting Modbus TCP server on localhost:502...")
        server = modbus_tcp.TcpServer(port=502)
        server.start()
        slave = server.add_slave(1)
        slave.add_block('0', cst.HOLDING_REGISTERS, 0, 100)
        slave.set_values('0', 0, [5000, 250, 600, 0])  # level=50.00, temp=25.0, pressure=6.00, status=0
        logger.info("Modbus TCP server running on localhost:502")
        while True:
            pass
    except Exception as e:
        logger.error(f"Failed to start Modbus server: {e}")
        raise

if __name__ == "__main__":
    main()