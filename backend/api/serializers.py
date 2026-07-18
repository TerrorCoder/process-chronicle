from rest_framework import serializers

class DraftSerializer(serializers.Serializer):
    label = serializers.CharField(max_length=100, required=True)
    content = serializers.CharField(required=True, allow_blank=True)

class GenerateSummaryRequestSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200, required=True)
    drafts = DraftSerializer(many=True, required=True)
    reflection = serializers.CharField(required=False, allow_blank=True, default='')

    def validate_drafts(self, value):
        if not value:
            raise serializers.ValidationError("At least one draft is required.")
        if len(value) < 2:
            raise serializers.ValidationError("At least two drafts are required to analyze changes.")
        if len(value) > 10:
            raise serializers.ValidationError("Maximum of 10 drafts is allowed.")
        
        # Check text length per draft to prevent abuse and costs
        for i, draft in enumerate(value):
            content = draft.get('content', '')
            if len(content) > 50000:  # ~10,000 words limit per draft
                raise serializers.ValidationError(
                    f"Draft {i+1} ('{draft.get('label', '')}') content exceeds the limit of 50,000 characters."
                )
        return value

    def validate_reflection(self, value):
        if len(value) > 10000:
            raise serializers.ValidationError("Reflection exceeds the limit of 10,000 characters.")
        return value
