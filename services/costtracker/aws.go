package costtracker

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/costexplorer"
)

func GetCostData() (costData, error) {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		return nil, err
	}

	client := costexplorer.NewFromConfig(cfg)

	input := &costexplorer.GetCostAndUsageRequest{
		TimePeriod: &types.DateInterval{
			Start: aws.Time(time.Now().AddDate(0, 0, -1)),
			End:   aws.Time(time.Now()),
		},
		Granularity: aws.String("DAILY"),
		Metrics:     []string{"BlendedCost"},
	}

	result, err := client.GetCostAndUsage(context.Background(), input)
	if err != nil {
		return nil, err
	}

	// Process result and return cost data
	// ...
}

func CheckAndAlertThreshold() {
	costData, err := GetCostData()
	if err != nil {
		log.Println("Error getting cost data:", err)
		return
	}

	if costData.TotalCost > 25 {
		// Send alert
		// ...
	}
}