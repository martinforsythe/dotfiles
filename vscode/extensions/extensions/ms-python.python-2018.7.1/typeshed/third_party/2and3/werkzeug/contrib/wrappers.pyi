from typing import Any

def is_known_charset(charset): ...

class JSONRequestMixin:
    def json(self): ...

class ProtobufRequestMixin:
    protobuf_check_initialization = ...  # type: Any
    def parse_protobuf(self, proto_type): ...

class RoutingArgsRequestMixin:
    routing_args = ...  # type: Any
    routing_vars = ...  # type: Any

class ReverseSlashBehaviorRequestMixin:
    def path(self): ...
    def script_root(self): ...

class DynamicCharsetRequestMixin:
    default_charset = ...  # type: Any
    def unknown_charset(self, charset): ...
    def charset(self): ...

class DynamicCharsetResponseMixin:
    default_charset = ...  # type: Any
    charset = ...  # type: Any
