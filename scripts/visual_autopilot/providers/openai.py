from .base import BaseProvider


class OpenAIProvider(BaseProvider):
    def generate(self, prompt, config):
        raise NotImplementedError

    def health_check(self):
        raise NotImplementedError

    def capabilities(self):
        raise NotImplementedError
