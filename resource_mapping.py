# resource_mapping.py
from models import BOLLog, TankData, StrappingTable, WeightScaleData, BlendingLog, BargeLoadingLog, TankTransferLog

# Dictionary mapping resources to their corresponding models
resource_map = {
    "bol": BOLLog,
    "tank": TankData,
    "strapping": StrappingTable,
    "weight_scales": WeightScaleData,
    "blending": BlendingLog,
    "barge_loading": BargeLoadingLog,
    "tank_transfer": TankTransferLog,
}

# List of valid resources derived from resource_map keys
VALID_RESOURCES = list(resource_map.keys())

# Optional: Add custom handlers for resources needing special logic
custom_handlers = {}  # Can be extended later